import mongoose, { Schema,model } from "mongoose";
 

  const RewardTransactionSchema = new Schema({
    nftId: {
      type: Schema.Types.ObjectId,
      ref: "tokenowners",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    stakeId: {
      type: Schema.Types.ObjectId,
      ref: "Stake",
    },
    stakingPoolId: {
      type: Schema.Types.ObjectId,
      ref: "StakingPool",
    },
    rewardTypeId: {
      type: Schema.Types.ObjectId,
      ref: "RewardType",
    },
    amountOfCoins: Number,
    claimedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    ownerid: {
        type:String
         
      }
  });
 

  export default mongoose.model('RewardTransaction',RewardTransactionSchema)

