import  Mongoose from "mongoose";
import moment from "moment";
import {UploadToBucket} from "../../helper/commonFUnction";
import StakingPool from "../../models/front_models/stakingpool.schema.js"
import Stake from "../../models/front_models/stake.schema.js"
import RewardType from "../../models/front_models/RewardType.schema.js"
import Token from "../../models/front_models/token.schema.js"
import TokenOwner from "../../models/front_models/tokenowner.schema.js"
import Collection from "../../models/front_models/collection.schema.js"
import Config from "../../config/serverConfig.js"
import collectionSchema from "../../models/front_models/collection.schema.js";
import RewardTransaction from "../../models/front_models/rewardTransaction.schema";
import User from "../../models/front_models/user.schema.js";

export const CreateStakingPool = async(req,res)=>{
  let {
    collectionId,
    lockPeriod,
    rewards,
    nftsStakeables,
    nftsBackedValues,
    isBackedValue,
    walletAddress,
    createdAt,
    CollectionName
  } = req.body;
//  CollectionName -- added for same nft id issue
  try{
    if (!rewards || rewards?.length <= 0 ){
     return res.status(200).json({status:false,msg:"rewards cannot be empty"}) 

    }

    for (const rw of rewards) {
      if (!rw.rewardTypeId) {
        if (!rw.type || !Config.RewardTypes[rw.type?.toUpperCase()]) {
          return res.status(200).json({status:false,msg:`${rw.name}: ${rw.type} not valid reward`}) 
        }
      }
    }
 
    const collection = await Collection.findOneAndUpdate(
      { _id: collectionId, creator: walletAddress},
      { $set: { isStakeable: true } },{new:true}
    )
    
    if (!collection) return res.status(200).json({status:false,msg:`Collection is not staked`}) 
    

    const rewardRates = await Promise.all(
      rewards.map(async (rw,i) => {
        if (rw.rewardTypeId) {
          return rw;
        }
        const newReward = new RewardType();
        newReward.addressContract = rw.addressContract;
        newReward.type = rw.type;
        newReward.name = rw.name;
        newReward.color = rw.color;
       await newReward.save();
        return {
          rewardTypeId: newReward._id,
          amount: rw.amount,
          rewardFrecuency: rw.rewardFrecuency,
        };
      })
    )

    var newdateformat = new Date(Number(createdAt)*1000);
    let newStakingPool = new StakingPool();
    newStakingPool.collectionId = collectionId;
    newStakingPool.lockPeriod = lockPeriod;
    newStakingPool.walletAddress = walletAddress;
    newStakingPool.isBackedValue = !!isBackedValue;
    newStakingPool.rewardRates = rewardRates;
    newStakingPool.createdAt = newdateformat.toISOString()

    await newStakingPool.save();
    if (nftsStakeables?.length) {
      await Promise.all(
        nftsStakeables.map(async (nft,i) => {
          await Token.findOneAndUpdate({NFTId:nftsStakeables[i],NFTBalance: { $gt: 0 },CollectionName:CollectionName },{ $set: { isStakeable: true ,
            backedValue:(nftsBackedValues?.length >0)? nftsBackedValues[i]:1}},{new:true})
          await TokenOwner.findOneAndUpdate({NFTId:nftsStakeables[i],NFTBalance: { $gt: 0 },CollectionName:CollectionName},{ $set: { isStakeable: true,
            backedValue:(nftsBackedValues?.length >0)? nftsBackedValues[i]:1 }},{new:true})
        })
      );
    }
   return res.status(200).json({status:true,msg:"staking pool created successfully",data:newStakingPool})
  }
  catch(err){
    console.log("err in pool creation",err)
  }


}


export const CreateStake = async(req,res)=>{

  const {NFTOwner,NFTId,CollectionName} = req.body
   
try{

  var collectiondata = await collectionSchema.find({collectionName:CollectionName})
  if(!collectiondata) return res.status(200).json({status:false,msg:"colleciton not found"})
  var collectionid = collectiondata[0]._id
  var pooldata = await StakingPool.find({collectionId:collectionid})
  if(!pooldata) return res.status(200).json({status:false,msg:"Stakingpool not found"})
  var   poolid = pooldata[0]._id
  var Data = await TokenOwner.find({NFTId:NFTId,NFTOwner:NFTOwner,CollectionName:CollectionName})
  var NFTOwnerData = Data[0]
  var ownerdetails = await User.find({WalletAddress:NFTOwner})
  var owner_userid = (ownerdetails[0]._id) 
 
  if(!NFTOwnerData?.isStakeable) return res.status(200).json({status:false,msg:"Not Stakeable"})

  var newStake = new Stake();
  newStake.nftId = NFTOwnerData._id;
  newStake.stakingPoolId = poolid;
  var testvl = await newStake.save();
  await TokenOwner.findOneAndUpdate({NFTId:NFTId,NFTOwner:NFTOwner,CollectionName:CollectionName},{$set:{isStake:true}},{new:true})
 

  let rewardTxsCreated = undefined;
  var test= collectiondata[0]
  var rewardRates = pooldata[0].rewardRates;
  const createdAt = moment(pooldata[0].createdAt);
  const now = moment();
  rewardTxsCreated = await Promise.all( 
    rewardRates.map(async (rwRt) => {
      const newRewardTx = new RewardTransaction();
      newRewardTx.nftId = NFTOwnerData._id;
      newRewardTx.ownerid = NFTOwnerData.NFTOwner;  // owner is of type objectid but current schema has address as id hence this new field is added
      newRewardTx.stakeId = newStake._id;
      newRewardTx.stakingPoolId = pooldata[0]._id;
      newRewardTx.rewardTypeId = rwRt.rewardTypeId;
      newRewardTx.createdAt = now.toDate();

      let amountminutesSinceLastReward = now.diff(createdAt, "minutes");
      
      newRewardTx.amountOfCoins =
        Math.floor(
          amountminutesSinceLastReward / (rwRt.rewardFrecuency * 60)
        ) *
        rwRt.amount *
        (NFTOwnerData.backedValue ?? 1);
      await newRewardTx.save();
      return newRewardTx;
    })
    )
  if (pooldata[0].isBackedValue) {
    await StakingPool.findByIdAndUpdate(poolid, {
      $set: {
        backedValuesAmount:
          (pooldata[0].backedValuesAmount ?? 0) + (NFTOwnerData.backedValue ?? 1),
      }
    },{new:true});
  }
  return res.status(200).json({status:true,msg:"Stake Added Successfully"})

}catch(err){
  
  return res.status(200).json({status:false,msg:"failed to add stake"})

}

}

export const getStakingPoolsByCollection = async(req,res)=>{
  try{
    let { collectionId } = req.query; 
    collectionId = Mongoose.Types.ObjectId(collectionId)

    const stakingPools = await StakingPool.find({ collectionId:collectionId })
    var rewarddata = stakingPools[0].rewardRates
    var rewardArr = []
   await Promise.all(
    rewarddata.map(async(data,i)=>{
      let resp = await RewardType.find({_id:data.rewardTypeId})
      rewardArr.push(resp[0])
    })
    )
    var responsedata = stakingPools[0]
    res.status(200).json({status:true,data:responsedata,rewardArr:rewardArr,msg:"success"})
     
  }
  catch(err){
    res.status(200).json({status:false,data:[],msg:"failed"})
  }
}

export const ClaimReward = async(req,res)=>{
  try{

    let {NFTId,NFTOwner,CollectionName } = req.body;
    var findtokenowner = await TokenOwner.find({NFTId:NFTId,NFTOwner:NFTOwner,CollectionName:CollectionName})
    var findstake = await Stake.find({nftId:Mongoose.Types.ObjectId(findtokenowner?.pop()?._id)}).populate("stakingPoolId")

    if(findstake?.length < 1) return res.status(200).json({status:false,msg:"stake not found"})
    var stakeId = Mongoose.Types.ObjectId(findstake?.[0]._id)
    var rewardTypeId = Mongoose.Types.ObjectId(findstake?.[0]?.stakingPoolId?.rewardRates?.[0]?.rewardTypeId)
   
    const stake = await Stake.findById(stakeId)
    if(stake){
      var owner = await TokenOwner.find({_id:stake.nftId})
    }

    const claimedRewards = await RewardTransaction.find({
      stakeId:stakeId,
      rewardTypeId:rewardTypeId,
      claimedAt: { $exists: false },
    });
    const result = await RewardTransaction.updateMany(
      {
        stakeId,
        rewardTypeId,
        // claimedAt: { $exists: false },  hidden because claim time will not be updated
      },
      { $set: { claimedAt: new Date() } },
      {new:true}
    );
    res.status(200).json({status:true,data:claimedRewards})
  
  }
  catch(err){
    res.status(200).json({status:false,data:[],msg:"failed"})

  }
}

export const withdrawStake = async(req,res)=>{
  try{
    let {NFTId, stakeId,NFTOwner ,CollectionName} = req.body;
    var findtokenowner = await TokenOwner.find({NFTId:NFTId,NFTOwner:NFTOwner,CollectionName:CollectionName})
    var findstake = await Stake.find({nftId:Mongoose.Types.ObjectId(findtokenowner?.[0]?._id)})
     if(findstake?.length < 1) return res.status(200).json({status:false,msg:"stake not found"})
    const stake = await Stake.findById(findstake?.pop()?._id).populate("stakingPoolId")

    if (!stake) {return res.status(200).json({status:false,msg:"stake not found"})}

    if(stake?.nftId){
       var owner = await TokenOwner.findById(stake.nftId)
       if(owner.NFTOwner != NFTOwner) return res.status(200).json({status:false,msg:"not owner"})
    }
    const updated = await Stake.findByIdAndUpdate(
      // findstake[0]._id,
      findstake?.pop()?._id,
      {
        $set: { isWithdraw: true },
      },
      { new: true }
    );
    await TokenOwner.findByIdAndUpdate(stake.nftId, { $set: { isStake: false } },{new:true});
    res.status(200).json({status:true,data:updated})

  }
  catch(err){
    res.status(200).json({status:false,data:""})
  }
}

// not used
export const stopStake = async (req, res) => {
  try{  
  let {NFTId, stakeId,NFTOwner } = req.body;
  var findtokenowner = await TokenOwner.find({NFTId:NFTId,NFTOwner:NFTOwner})
  var findstake = await Stake.find({nftId:Mongoose.Types.ObjectId(findtokenowner?.[0]?._id)})
  if(findstake?.length < 1) return res.status(200).json({status:false,msg:"stake not found"})
  const updated = await Stake.findByIdAndUpdate(
    findstake[0]._id,
    {
      $set: { stopedAt: new Date() },
    },
    { new: true }
  );

  await TokenOwner.findByIdAndUpdate(findstake[0].nftId, { $set: { isStake: false } },{new:true});
  res.status(200).json({status:true,data:updated})

  }
  catch(err){
    res.status(200).json({status:false,msg:"failed to stop stake"})
  }
}
export const updateNFTBackedValue = async(req,res)=>{
  try{
    let { stakingPoolId, NFTOwner,NFTId ,value,CollectionName} = req.body;
    stakingPoolId = Mongoose.Types.ObjectId(stakingPoolId)  
    let stakingPool = await StakingPool.findById(stakingPoolId).populate(
      "collectionId",
      "Creator"
    );
    if(!stakingPool) return res.status(200).json({status:false,msg:"pool not found"})
    var owner = await TokenOwner.findOne({NFTOwner:NFTOwner,NFTId:NFTId,CollectionName:CollectionName})
    if(!owner) return res.status(200).json({status:false,msg:"owner not found"})
    if ( stakingPool.collectionId.Creator.toString() !== owner.NFTOwner.toString()) return res.status(200).json({status:false,msg:"owner invalid"})

    const updatedNFT = await TokenOwner.findByIdAndUpdate(
      owner._id,
      {
        $set: { backedValue: value },
      },
      { new: true }
    );
    var colldata = await Collection.findOne({collectionName:owner.CollectionName})
    var nftowners = await TokenOwner.find({CollectionName:owner.CollectionName})
    let amountBackedValue = 0;
    for (let n of nftowners) {
      amountBackedValue += n.backedValue ?? 1;
    }
    const updated = await StakingPool.updateMany(
      {
        collectionId: colldata._id,
      },
      {
        $set: { backedValuesAmount: amountBackedValue ,isBackedValue:true},
      },{new:true}
    );
    stakingPool = await StakingPool.findById(stakingPoolId);
    res.status(200).json({status:true,data:stakingPool,msg:"failed"})

  }
  catch(err){
    res.status(200).json({status:false,msg:"failed"})
  }
}
// not used
export const getTopStakers = async (req, res) => {
try{

  const data = await Stake.aggregate([
    {
      $match: {
        isWithdraw: false,
        stopedAt: { $exists: false },
        $or: [
          { expiresAt: { $gte: new Date() } },
          { expiresAt: { $exists: false } },
        ],
      },
    },
     {
        $lookup: {
          from: "tokenowners",
          foreignField: "_id",
          localField: "nftId",
          as: "owner",
        },
      },
      
       {
             $unwind: {
                    path: "$owner",
                    preserveNullAndEmptyArrays: true,
                  },
           },
                {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "owner.NFTOwner",
          as: "userinfo",
        },
      },
          
      {
        $unwind: {
               path: "$userinfo",
               preserveNullAndEmptyArrays: true,
             },
      },
           


])
  res.status(200).json({status:true,data:data})

}
catch(err){
  res.status(200).json({status:false,msg:"failed"})
}

}
//not used
export const updateStakingPool = async (req, res) => {
try{
  let { stakingPoolId ,NFTOwner,lockPeriod, rewardRates, nftsStakeables} = req.body;
  stakingPoolId = Mongoose.Types.ObjectId(stakingPoolId)  
  const changes = {};
  const stakingPool = await StakingPool.findById(stakingPoolId).populate("collectionId","Creator")
  if (!stakingPool) return res.status(200).json({status:false,msg:"pool not found"})
  if (stakingPool.collectionId.Creator.toString() !== NFTOwner.toString())  return res.status(200).json({status:false,msg:"owner not found"})
  const rewardsSignedUrls = [];
  if (rewardRates?.length) {
    const rewardRatesBuilt = await Promise.all(
      rewardRates.map(async (rw) => {
        if (rw.rewardTypeId) {
          return rw;
        }
        const newReward = new RewardType();
        newReward.addressContract = rw.addressContract;
        newReward.type = rw.type;
        newReward.name = rw.name;
        newReward.color = rw.color;
        await newReward.save();
        return {
          rewardTypeId: newReward._id,
          amount: rw.amount,
          rewardFrecuency: rw.rewardFrecuency,
        };
        
      })

    )
    changes.rewardRates = rewardRatesBuilt;
  }
  if (lockPeriod) {
    changes.lockPeriod = lockPeriod;
  }
  if (nftsStakeables?.length) {
    await TokenOwner.updateMany(
      {
        collectionId: stakingPool.collectionId,
        _id: { $in: nftsStakeables },
      },
      [{ $set: { isStakeable: { $not: "$isStakeable" } } },{new:true}]
    );
  }
  const updated = await StakingPool.findByIdAndUpdate(
    stakingPoolId,
    {
      $set: changes,
    },
    { new: true }
  );
  res.status(200).json({status:true,msg:"success",data:updated})


}
catch(err){
  res.status(200).json({status:false,msg:"failed"})
}
}

export const getStakes = async(req,res)=>{

try{
    var { collectionId, NFTOwner ,page} = req.query;
    const pageSize = 30;
    var collection = null;


    var collectiondata = await Collection.findOne({_id:Mongoose.Types.ObjectId(collectionId)})
    var tokenownerslist = await TokenOwner.find({CollectionName:collectiondata.collectionName,NFTBalance:{$gt:0}})

    if(tokenownerslist){
      var ownerids = tokenownerslist.map((nft) => {return (Mongoose.Types.ObjectId(nft._id))})
    }


    var pipelines =  [
      {
        $match: {
          isWithdraw: false,
          $or: [
            { expiresAt: { $gte: new Date() } },
            { expiresAt: { $exists: false } },
          ],
        },
      },
    ];
    if (collectionId) {
      pipelines.push({$match:{nftId: { $in: ownerids}}}) 
     }
    let stakes = [];
    if (collectiondata && collectiondata.hasRetroactiveRewards) {
      var stakingPool = await StakingPool.findOne({ collectionId });
      if(!stakingPool) return res.status(200).json({status:false,msg:"staking pool not available"})
      stakes = await computeRetroactiveRewardsByCollection(
        collectionId,
        collectiondata.collectionName,
        stakingPool._id,
        page,
        pageSize
      );
    }
    else{
      pipelines = [
        ...pipelines,
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
        {
          $lookup: {
            from: "rewardtransactions",
            let: { idStake: "$_id" },
            pipeline: [
              { 
                $match: {
                  $expr: { $eq: ["$$idStake", "$stakeId"] },
                },
              },
              {
                $project: {
                  rewardTypeId: 1,
                  amountOfCoins: 1,
                  createdAt: 1,
                  owner: 1,
                  claimedAt: 1,
                },
              },
              { $sort: { createdAt: -1 } },
            ],
            as: "rewardsClaimed",
          },
        },
      ]
      stakes = await Stake.aggregate(pipelines);
      await TokenOwner.populate(stakes, {path: "nftId"})
     
      await StakingPool.populate(stakes, { path: "stakingPoolId" });
      await RewardType.populate(stakes, {
        path: "stakingPoolId.rewardRates.rewardTypeId",
      });

      stakes = await Promise.all(
        stakes.map(async (stake) => {

          const createdAt = moment(stake.createdAt);
          const now = stake.stopedAt ? moment(stake.stopedAt) : moment();
          const rewardsTxs = await RewardTransaction.find({
            stakeId: stake._id,
          }).sort({ createdAt: -1 });

          const claimedRwByRwType = {};
          for (const rwC of rewardsTxs) {
            if (claimedRwByRwType[rwC.rewardTypeId]) {
              claimedRwByRwType[rwC.rewardTypeId].push(rwC);
            } else {
              claimedRwByRwType[rwC.rewardTypeId] = [rwC];
            }
          }
          const rewardsInformation = stake.stakingPoolId.rewardRates.map(
            (rwRate) => {
              const rewards =
                claimedRwByRwType[rwRate.rewardTypeId._id.toString()] ?? [];
              const rwInfo = {
                rewardTypeId: rwRate.rewardTypeId,
                rewardFrecuencyMins: rwRate.rewardFrecuency * 60,
                amountOfClaimedRewards: 0,
                amountOfPendingRewards: 0,
                amountminutesSinceLastReward: 0,
              };
              const rewardsPending = rewards.filter((r) => !r.claimedAt);
              const rewardsClaimed = rewards.filter((r) => r.claimedAt);

              const [lastClaimedReward] = rewardsClaimed;
              for (const rw of rewardsPending) {
                rwInfo.amountOfPendingRewards += rw.amountOfCoins;
              }
              for (const rw of rewardsClaimed) {
                rwInfo.amountOfClaimedRewards += rw.amountOfCoins;
              }
              let amountminutesSinceLastReward = lastClaimedReward
                ? now.diff(moment(lastClaimedReward.claimedAt), "minutes")
                : now.diff(createdAt, "minutes");

              if (!stake.stopedAt) {
                rwInfo.amountminutesSinceLastReward =
                  amountminutesSinceLastReward;
              }
              return rwInfo;
            }
          );

          return { ...stake, rewardsClaimed: rewardsInformation };
        })
      )
    res.status(200).json({staus:true,stakes:stakes})
    }

 

  }

 catch(err){
  res.status(200).json({status:false,msg:"get stakes failed"})
}
}

const computeRetroactiveRewardsByCollection = async(  
  collectionId,
  collectionName,
  stakingPoolId,
  page,
  pageSize)=>{

    const now = moment();
    const stakingPool = await StakingPool.findById(stakingPoolId).populate(
      "rewardRates.rewardTypeId"
    );
 
    let nfts = await TokenOwner.find({ CollectionName:collectionName }).skip((page - 1) * pageSize).limit(pageSize)
    const stakes = await Stake.find({
      nftId: { $in: nfts.map((nft) => nft._id) },
      isWithdraw: false,
    });


  if (stakes.length) {
    nfts = (
      await Promise.all(
        nfts.map(async (nft) => {
          const stake = stakes.find(
            (st) => st.nftId.toString() === nft._id.toString()
          );
          if (!stake) {
            return nft;
          }
          if (stake.stopedAt || !moment(stake.expiresAt).isAfter(now)) {
            return null;
          }
          //logic to get the real rewards for existing stakes
          const createdAt = moment(stake.createdAt);
          await TokenOwner.populate(stake, {path: "nftId" });
 
          await StakingPool.populate(stake, { path: "stakingPoolId" });
          await RewardType.populate(stake, {
            path: "stakingPoolId.rewardRates.rewardTypeId",
          });
          const rewardsTxs = await RewardTransaction.find({
            stakeId: stake._id,
          }).sort({ createdAt: -1 });

          const claimedRwByRwType = {};
          for (const rwC of rewardsTxs) {
            if (claimedRwByRwType[rwC.rewardTypeId]) {
              claimedRwByRwType[rwC.rewardTypeId].push(rwC);
            } else {
              claimedRwByRwType[rwC.rewardTypeId] = [rwC];
            }
          }
          const rewardsInformation = stakingPool.rewardRates.map((rwRate) => {
            const rewards =
              claimedRwByRwType[rwRate.rewardTypeId._id.toString()] ?? [];
            const rwInfo = {
              rewardTypeId: rwRate.rewardTypeId,
              rewardFrecuencyMins: rwRate.rewardFrecuency * 60,
              amountOfClaimedRewards: 0,
              amountOfPendingRewards: 0,
              amountminutesSinceLastReward: 0,
            };
            const rewardsPending = rewards.filter((r) => !r.claimedAt);
            const rewardsClaimed = rewards.filter((r) => r.claimedAt);

            const [lastClaimedReward] = rewardsClaimed;
            for (const rw of rewardsPending) {
              rwInfo.amountOfPendingRewards += rw.amountOfCoins;
            }
            for (const rw of rewardsClaimed) {
              rwInfo.amountOfClaimedRewards += rw.amountOfCoins;
            }
            let amountminutesSinceLastReward = lastClaimedReward
              ? now.diff(moment(lastClaimedReward.claimedAt), "minutes")
              : now.diff(createdAt, "minutes");

            if (!stake.stopedAt) {
              rwInfo.amountminutesSinceLastReward =
                amountminutesSinceLastReward;
            }
            return rwInfo;
          });
          return { ...stake._doc, rewardsClaimed: rewardsInformation };

        }
        )
        )
    ).filter((nft) => !!nft)

  }

  const rewardRates = stakingPool.rewardRates;
  const createdAt = moment(stakingPool.createdAt);
  const rewardsInfo = rewardRates.map((rwRt) => {
    const rwInfo = {
      rewardTypeId: rwRt.rewardTypeId,
      rewardFrecuencyMins: rwRt.rewardFrecuency * 60,
      amountOfClaimedRewards: 0,
      amountOfPendingRewards: 0,
      amountminutesSinceLastReward: 0,
    };
    let amountminutesSinceLastReward = now.diff(createdAt, "minutes");

    rwInfo.amountminutesSinceLastReward = amountminutesSinceLastReward;
    rwInfo.amountOfPendingRewards =
      Math.floor(amountminutesSinceLastReward / (rwRt.rewardFrecuency * 60)) *
      rwRt.amount;
    return rwInfo;
  });
  return nfts.map((nft) => {
    if (nft.nftId) {
      return nft;
    }
    const rewardsWithBackedValue = rewardsInfo.map((r) => ({
      ...r,
      amountOfPendingRewards: r.amountOfPendingRewards * (nft.backedValue ?? 1),
    }));
    return {
      nftId: nft,
      stakingPoolId: { ...stakingPool._doc },
      rewardsClaimed: rewardsWithBackedValue,
    };
  });
}
 

export const nftpooldetails = async(req,res)=>{
  try{
      // staking pool datas with reward rates
      var collectionid = Mongoose.Types.ObjectId(req.query.collectionId)
      var staingpool = await StakingPool.findOne({collectionId:collectionid})
      res.status(200).json({Status:true,data:staingpool})
      // get staked nfts of the collection
      


 
  }
  catch(err){
    res.status(200).json({Status:true,data:[],msg:"failed to get pool details"})

  }
}

//getpoolinfopage
export const getpoolinfopage = async(req,res)=>{
  try{
      var collectiondata = await collectionSchema.findOne({collectionName:req.query.collectionName})
      if(collectiondata){
        var pool = await StakingPool.findOne({collectionId:Mongoose.Types.ObjectId(collectiondata._id)})
        var reward = await RewardType.find({_id:pool?.rewardRates[0]?.rewardTypeId})
        var getnft = await TokenOwner.find({NFTId:req.query.NFTId,
                                                   NFTOwner:req.query.NFTOwner,collectionName:req.query.collectionName})

        var getstakenft =  await Stake.find({nftId:Mongoose.Types.ObjectId(getnft[0]?._id)}).sort({createdAt:-1})
        var stakenft = getstakenft[0]?.createdAt
        var getdata = new Date(stakenft)
        getdata = getdata.setHours(getdata.getHours() + pool.lockPeriod)
        var getlockdate = new Date(getdata)
        res.status(200).json({status:true,data:{
          lockPeriod:pool.lockPeriod,
          createdAt:pool.createdAt,
          poolid:pool._id,
          walletAddress:pool.walletAddress,
          rewardContractAddress:reward[0].addressContract,
          rewardRates:pool?.rewardRates[0],
          lockDate:getlockdate
        }})
      }
    
  }
  catch(err){
    res.status(200).json({status:false,msg:"failed"})

  }
}

export const getcollection = async(req,res)=>{
  try{
    var data = await collectionSchema.find(req.query)
    res.status(200).json({status:true,data:data[0]})
  }
  catch(err){
    res.status(200).json({status:false,msg:"failed"})

  }
}


export const updateeligibility = async(req,res)=>{
  try{
   var resp = await TokenOwner.findOneAndUpdate(req.body,{$set:{isStakeable:true}},{new:true})
   var tokenupdate = await Token.findOneAndUpdate({NFTId:req.body.NFTId,CollectionName:req.body.CollectionName},{$set:{isStakeable:true}},{new:true})

    res.status(200).json({status:true,msg:"eligibilty updated"})

  }
  catch(err){
    res.status(200).json({status:false,msg:"failed"})
  }
}

export const updateBackValueDB = async(req,res)=>{
  try{
   var resp = await TokenOwner.findOneAndUpdate(req.body,{$set:{isStakeable:true}},{new:true})
   var tokenupdate = await Token.findOneAndUpdate({NFTId:req.body.NFTId},{$set:{isStakeable:true}},{new:true})

    res.status(200).json({status:true,msg:"eligibilty updated"})

  }
  catch(err){
    res.status(200).json({status:false,msg:"failed"})
  }
}

export const getStakes2 = async(req,res)=>{
  
  try{
      var { collectionId, NFTOwner ,page} = req.query;
      const pageSize = 30;
      var collection = null;

      var collectiondata = await Collection.findOne({_id:Mongoose.Types.ObjectId(collectionId)})
      var tokenownerslist = await TokenOwner.find({CollectionName:collectiondata.collectionName,NFTBalance:{$gt:0}})
      if(tokenownerslist){
        var ownerids = tokenownerslist.map((nft) => {return (Mongoose.Types.ObjectId(nft._id))})
      }
        var stakingPool = await StakingPool.findOne({collectionId: collectionId });
        if(!stakingPool) return res.status(200).json({status:false,msg:"staking pool not available"})
        stakes = await computeRetroactiveRewardsByCollection(
          collectionId,
          collectiondata.collectionName,
          stakingPool._id,
          page,
          pageSize
        );
        res.status(200).json({staus:true,stakes:stakes})  
      
    }
  
   catch(err){
    res.status(200).json({status:false,msg:"get stakes failed"})
  }
  }
  


  export const PendingClaimedRewards  = async(req,res)=>{
    try{
      var Arr = JSON.parse(req.query[0])?.searchArr
      if(Arr.length >0){
        var calculatedArr =  [];
        await Promise.all(
          await Arr.map(async(nft,i)=>{
             var owner =  await TokenOwner.find({NFTId:nft.NFTId,NFTOwner:nft.NFTOwner,CollectionName:nft.CollectionName,isStakeable:true,isStake:true})
             var nftid = owner.pop()._id
             var rewardtx = await RewardTransaction.find({nftId:nftid})
             var rewarddata = rewardtx.pop()
            let rewardamount = {}
            if(!rewarddata?.claimedAt) rewardamount.claimed = 0
            else{
              var timediff = Number(moment(rewarddata?.claimedAt).diff(rewarddata?.createdAt, "hours"))/Number(nft.rewardFrecuency)
              var claimAmt = Number(timediff)*Number(nft.rewardamount)*Number(nft.backedValue)
              rewardamount.claimed = claimAmt
            }
            // calculation for Pending rewards---------->
            if(!rewarddata?.claimedAt){
              var timediff_pending = Number(nft.lockPeriod)/Number(nft.rewardFrecuency)
              var pendingAmt = Number(timediff_pending)*Number(nft.rewardamount)*Number(nft.backedValue)
              rewardamount.pending = pendingAmt
            }else{
        
          var timediff = (Number(moment(rewarddata?.claimedAt).diff(rewarddata?.createdAt, "hours"))  )
          var timediff_claimed =  Number(nft.lockPeriod) - timediff
          var timediff_pending =  Number(timediff_claimed)/Number(nft.rewardFrecuency)
          var pendingAmt = Number(timediff_pending)*Number(nft.rewardamount)*Number(nft.backedValue)
          rewardamount.pending = pendingAmt
            }
            
            let out = nft
            out.claimed = rewardamount.claimed
            out.pending = rewardamount.pending
            calculatedArr.push(out)
          
          })
        )
        res.status(200).json({status:true,data:calculatedArr})
      }
      else res.status(200).json({status:true,data:[]})

    }
    catch(err){
      res.status(200).json({status:false,data:[]})

    }
  }



  export const UserCollectionMigration = async(req,res)=>{
    try{
      var data = {_id:Mongoose.Types.ObjectId("6399d2dcd5b6490d49c1c3c0")}
        var testid = new TokenOwner(data)
        var test = await testid.save()
        var testid2 = new Token(data)
        var test2 = await testid2.save()
    }
    catch(err){
         console.log("save err",err)
    }
  }