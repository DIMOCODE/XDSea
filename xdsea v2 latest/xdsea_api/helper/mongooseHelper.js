import { isEmpty } from "./commonFUnction";

import CollectionSchema from '../models/front_models/collection.schema'
import ActivitySchema from '../models/front_models/activity.schema'
import Config from '../config/serverConfig'
import TokenOwners from '../models/front_models/tokenowner.schema'
// import Moralis  from 'moralis';
// import { EvmChain } from '@moralisweb3/evm-utils';
const Moralis = require("moralis").default;
// const fetch = require('node-fetch');
export const FindOne = async (data) => {
  const { DBName, FinData, SelData } = data;
  try {
    let FinOnData = await DBName.findOne(FinData, SelData);
    return {
      success: !isEmpty(FinOnData) ? "success" : "error",
      msg: !isEmpty(FinOnData) ? FinOnData : null,
    };
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};

export const Find = async (data) => {
  const { DBName, FinData, SelData, limit, skip } = data;
  try {
    if (limit) {
      var FinOnData = await DBName.find(FinData, SelData)
        .skip(skip)
        .limit(limit);
    } else {
      var FinOnData = await DBName.find(FinData, SelData);
    }

    return { success: "success", msg: FinOnData };
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};
export const FindOneAndUpdate = async (data) => {
  const { DBName, FinData, Updata, save } = data;
  try {
    let FinOnUData = await DBName.findOneAndUpdate(FinData, Updata, save);

    return {
      success: FinOnUData ? "success" : "error",
      msg: FinOnUData ?? "Nothing To Update.. Try Again",
      data: FinOnUData,
    };
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};
export const Save = async (data) => {
  const { DBName, Data } = data;
  try {
    let saveData = new DBName(Data);
    let FinOnUData = await saveData.save();
    return {
      success: FinOnUData ? "success" : "error",
      msg: !isEmpty(FinOnUData) ? FinOnUData : null,
      data: FinOnUData
    };
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};

export const Aggregate = async (data) => {
  const { DBName, Query } = data;

  try {
    var Que = await DBName.aggregate(Query);
    return {
      success: Que.length > 0 ? "success" : "error",
      msg: "OK",
      data: Que,
    };
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};

export const FindOneAndRemove = async (data) => {
 
  const { DBName, FinData, Updata, save } = data;
  try {
    var record = await DBName.findOneAndRemove(FinData);
    if (record != null) {
      return { success: "success", msg: record };
    }
  } catch (err) {
    return { success: "error", msg: err.toString() };
  }
};

export const Activity = async (data) => {
  const { Activity, From, To } = data;
  if (
    Activity === "Follow" ||
    Activity === "UnFollow" ||
    Activity === "Like" ||
    Activity === "DisLike"
  ) {
    var finVal = {
      DBName: ActivitySchema,
      FinData: { From: From, To: To },
      Updata: { $set: data },
      save: { new: true },
    };
    await FindOneAndUpdate(finVal);
  } else {
    var SenVal = { DBName: ActivitySchema, Data: data };
    var chk = await Save(SenVal);
  }
};

export const TokenList = async (data) => {
  const {
    ProfileUrl,
    limit,
    skip,
    tokenOwnerMatch,
    sort,
    TokenMatch,
    from,
    Tokens,
    TabName,
  } = data;
  try {
    var Query = [
      {
        $match: TokenMatch,
      },
      {
        $lookup: {
          from: "users",
          let: { proName: "$NFTCreator" },
          pipeline: [
            { $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } } },
          ],
          as: "tokenCreator",
        },
      },
      {
        $unwind: {
          path: "$tokenCreator",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "tokenowners",
          let: { tId: "$NFTId" },
          pipeline: [
            { $match: tokenOwnerMatch },

            {
              $lookup: {
                from: "users",
                let: { proName: "$NFTOwner" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } },
                  },
                ],
                as: "tokenowners_user",
              },
            },
            {
              $unwind: {
                path: "$tokenowners_user",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "tokenowners_list",
        },
      },
      { $unwind: "$tokenowners_list" },

      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          NFTId: 1,
          NFTName: 1,
          NFTOrginalImage: 1,
          NFTThumpImage: 1,
          CompressedFile: 1,
          CompressedThumbFile: 1,
          ContractAddress: 1,
          ContractType: 1,
          ContractName: 1,
          NFTCreator: 1,
          Category: 1,
          NFTRoyalty: 1,
          updatedAt: 1,
          CollectionNetwork: 1,
          fileType: 1,
          NFTOwner: "$tokenowners_list.NFTOwner",
          HashValue: "$tokenowners_list.HashValue",
          PutOnSale: "$tokenowners_list.PutOnSale",
          PutOnSaleType: "$tokenowners_list.PutOnSaleType",
          NFTPrice: "$tokenowners_list.NFTPrice",
          CoinName: "$tokenowners_list.CoinName",
          NFTQuantity: "$tokenowners_list.NFTQuantity",
          NFTBalance: "$tokenowners_list.NFTBalance",
          ClockTime: "$tokenowners_list.ClockTime",
          EndClockTime: "$tokenowners_list.EndClockTime",
          DisplayName: { $cond: { if: { $ne: ["$tokenowners_list.tokenowners_user.DisplayName", ''] }, then: "$tokenowners_list.tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_list.tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_list.tokenowners_user.WalletAddress", 39, -1] }] } } },
          tokenowners_list_count: '$tokenowners_list_count',
          // DisplayName: "$tokenowners_list.tokenowners_user.DisplayName",
          CustomUrl: "$tokenowners_list.tokenowners_user.CustomUrl",
          WalletAddress: "$tokenowners_list.tokenowners_user.WalletAddress",
          Owner_Profile: "$tokenowners_list.tokenowners_user.Profile",
          Cover: "$tokenowners_list.tokenowners_user.Cover",
          Creator_DisplayName: { $cond: { if: { $ne: ["$tokenCreator.DisplayName", ''] }, then: "$tokenCreator.DisplayName", else: { $concat: [{ $substr: ["$tokenCreator.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenCreator.WalletAddress", 39, -1] }] } } },

          Creator_DisplayName: "$tokenCreator.DisplayName",
          Creator_CustomUrl: "$tokenCreator.CustomUrl",
          Creator_WalletAddress: "$tokenCreator.WalletAddress",
          Creator_Profile: "$tokenCreator.Profile",
          Creator_Cover: "$tokenCreator.Cover",
          TokenOwner_Name: "$tokenowners_list.TokenOwner_Name",
          bannerpromotion: "$tokenowners_list.bannerpromotion",
          isStake: "$tokenowners_list.isStake",
          isStakeable: "$tokenowners_list.isStakeable",
          backedValue: "$tokenowners_list.backedValue",

          tokenowner_id: "$tokenowners_list._id",
          SaleStatus:"tokenowners_list.SaleStatus"
 


          // Counts: { $cond: { if: { $isArray: "$TokenOwnerDetails" }, then: { $size: "$TokenOwnerDetails" }, else: 0} }
        },
      },
    ],
      Query_Count = [
        {
          $match: TokenMatch,
        },

        {
          $lookup: {
            from: "tokenowners",
            let: { tId: "$NFTId" },
            pipeline: [
              { $match: tokenOwnerMatch },
            ],
            as: "tokenowners_list",
          },
        },

        {
          $project: {
            _id: 0,
            tokenowners_list: "$tokenowners_list"
          },
        },
      ];
    var Agg = await Aggregate({ Query: Query, DBName: Tokens });
    Agg.from = from;
    Agg.Count = 0

    return Agg;
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};

export const TokenInfo = async (data) => {
  const {
    ProfileUrl,
    limit,
    skip,
    tokenOwnerMatch,
    sort,
    TokenMatch,
    from,
    Tokens,
    TabName,
    NFTOwner,
    Id,
    myowner,
  } = data;

  try {
    var Query = [
      {
        $match: TokenMatch,
      },
      {
        $lookup: {
          from: "tokenowners",
          let: { tId: "$NFTId" ,collname:"$CollectionName"},
          pipeline: [
            { $match: myowner },

            {
              $lookup: {
                from: "users",
                let: { proName: "$NFTOwner" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } },
                  },
                ],
                as: "tokenowners_users",
              },
            },
            {
              $unwind: {
                path: "$tokenowners_users",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                _id: 0,
                NFTId: 1,
                NFTOwner: 1,
                HashValue: 1,
                PutOnSale: 1,
                PutOnSaleType: 1,
                NFTPrice: 1,
                CoinName: 1,
                NFTQuantity: 1,
                NFTBalance: 1,
                ClockTime: 1,
                EndClockTime: 1,
                updatedAt: 1,
                CollectionName:1,
                // { $cond: { if: { $isArray: "$NFTOwnerDetails" }, then: { $size: "$TokenOwnerDetails" }, else: 0} }
                DisplayName: { $cond: { if: { $ne: ["$tokenowners_users.DisplayName", ''] }, then: "$tokenowners_users.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_users.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_users.WalletAddress", 3, -1] }] } } },
                CustomUrl: "$tokenowners_users.CustomUrl",
                WalletAddress: "$tokenowners_users.WalletAddress",
                Profile: "$tokenowners_users.Profile",
                Cover: "$tokenowners_users.Cover",
              },
            },
          ],
          as: "myowner",
        },
      },
      {
        $lookup: {
          from: "tokenowners",
          let: { tId: "$NFTId" , collname:"$CollectionName"},
          pipeline: [
            { $match: tokenOwnerMatch },
            {
              $lookup: {
                from: "users",
                let: { proName: "$NFTOwner" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$WalletAddress", "$$proName"] }
                    },
                  },
                ],
                as: "tokenowners_user",
              },
            },
            {
              $unwind: {
                path: "$tokenowners_user",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                _id: 0,
                NFTId: 1,
                NFTOwner: 1,
                HashValue: 1,
                PutOnSale: 1,
                PutOnSaleType: 1,
                NFTPrice: 1,
                CoinName: 1,
                NFTQuantity: 1,
                NFTBalance: 1,
                ClockTime: 1,
                EndClockTime: 1,
                updatedAt: 1,
                isStake: 1,
                isStakeable: 1,
                backedValue: 1,
                CollectionName: 1,
                DisplayName: "$tokenowners_user.DisplayName",
                CustomUrl: "$tokenowners_user.CustomUrl",
                WalletAddress: "$tokenowners_user.WalletAddress",
                Profile: "$tokenowners_user.Profile",
                Cover: "$tokenowners_user.Cover",
                EmailId: "$tokenowners_user.EmailId",
              },
            },
          ],
          as: "tokenowners_list",
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          foreignField: "WalletAddress",
          localField: "NFTCreator",
          as: "tokenCreator",
        },
      },
      {
        $lookup: {
          from: "usercollections",
          foreignField: "collectionName",
          localField: "CollectionName",
          as: "collectionDetails",
        },
      },
      {
        $unwind: {
          path: "$tokenCreator",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$collectionDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          NFTId: 1,
          NFTName: 1,
          NFTOrginalImage: 1,
          likecount: 1,
          previouslyListed :  1,  // previously listed
          marketAddress: 1,
          hasOpenOffer  :1,
          isWithdrawn:1,
          NFTThumpImage: 1,
          CompressedFile: 1,
          NFTRoyalty: 1,
          CompressedThumbFile: 1,
          ContractAddress: 1,
          ContractType: 1,
          Category: 1,
          ContractName: 1,
          myowner: 1,
          NFTCreator: 1,
          MetaData: 1,
          NFTQuantity: 1,
          NFTOrginalImageIpfs: 1,
          NFTDescription: 1,
          updatedAt: 1,
          NFTOwnerDetails: 1,
          CollectionNetwork: 1,
          tokenowners_list: 1,
          fileType: 1,
          CollectionName: 1,
          UnlockContent:1,
          NFTProperties: 1,
          Creator_DisplayName: { $cond: { if: { $ne: ["$tokenCreator.DisplayName", ''] }, then: "$tokenCreator.DisplayName", else: { $concat: [{ $substr: ["$tokenCreator.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenCreator.WalletAddress", 39, -1] }] } } },
          Creator_DisplayName: "$tokenCreator.DisplayName",
          // Creator_ProfileUrl: "$tokenCreator.ProfileUrl",/CustomUrl
          Creator_ProfileUrl: "$tokenCreator.CustomUrl",
          Creator_WalletAddress: "$tokenCreator.WalletAddress",
          Creator_Profile: "$tokenCreator.Profile",
          Creator_Cover: "$tokenCreator.Cover",
          Current_Owner: {
            $filter: {
              input: "$tokenowners_list",
              as: "item",
              cond: { $and: [{ $eq: ["$$item.NFTOwner", NFTOwner] }] },
            }

          },
          collectionCustomUrl: "$collectionDetails.customUrl"
        },
      },
    ];
    var Agg = await Aggregate({ Query: Query, DBName: Tokens });
    Agg.from = from;
    return Agg;
  } catch (e) {
    //    // console.log(e)
    return { success: "error", msg: e.toString() };
  }
};
export const Explore = async (data) => {
  const {
    DBName,
    limit,
    sort,
    match,
    MyAdd
  } = data;

  try {
    var Query = [
      {
        $match: match,
      },
      { $limit: limit },
      { $sort: sort },
      {
        $lookup: {
          from: "tokens",
          let: { tId: "$NFTId" },
          pipeline: [
            { $match: { $expr: { $eq: ['$NFTId', '$$tId',] } } },
            {
              $lookup: {
                from: "users",
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$WalletAddress", MyAdd] } },
                  },
                ],
                as: "tokenowners_users",
              },
            },
            {
              $unwind: "$tokenowners_users"
            }
          ],
          as: "Tokens",
        },
      },
      { $unwind: '$Tokens' },
      {
        $project: {
          _id: 0,
          NFTId: '$Tokens.NFTId',
          NFTName: '$Tokens.NFTName',
          NFTOrginalImage: '$Tokens.NFTOrginalImage',
          NFTThumpImage: '$Tokens.NFTThumpImage',
          CompressedFile: '$Tokens.CompressedFile',
          CompressedThumbFile: '$Tokens.CompressedThumbFile',
          ContractAddress: '$Tokens.ContractAddress',
          ContractType: '$Tokens.ContractType',
          ContractName: '$Tokens.ContractName',
          NFTCreator: '$Tokens.NFTCreator',
          NFTRoyalty: '$Tokens.NFTRoyalty',
          updatedAt: '$Tokens.updatedAt',
          CollectionNetwork: '$Tokens.CollectionNetwork',
          NFTOwner: 1,
          HashValue: 1,
          PutOnSale: 1,
          PutOnSaleType: 1,
          NFTPrice: 1,
          CoinName: 1,
          NFTQuantity: 1,
          NFTBalance: 1,
          ClockTime: 1,
          EndClockTime: 1,
          DisplayName: { $cond: { if: { $ne: ["$Tokens.tokenowners_list.tokenowners_user.DisplayName", ''] }, then: "$Tokens.tokenowners_list.tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$Tokens.tokenowners_list.tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$Tokens.tokenowners_list.tokenowners_user.WalletAddress", 39, -1] }] } } },

          DisplayName: "$Tokens.tokenowners_list.tokenowners_user.DisplayName",
          CustomUrl: "$Tokens.tokenowners_list.tokenowners_user.CustomUrl",
          WalletAddress: "$Tokens.tokenowners_list.tokenowners_user.WalletAddress",
          Profile: "$Tokens.tokenowners_list.tokenowners_user.Profile",
          Cover: "$tokenowners_list.tokenowners_user.Cover",
          Creator_DisplayName: { $cond: { if: { $ne: ["$tokenCreator.DisplayName", ''] }, then: "$tokenCreator.DisplayName", else: { $concat: [{ $substr: ["$tokenCreator.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenCreator.WalletAddress", 39, -1] }] } } },

          Creator_DisplayName: "$tokenCreator.DisplayName",
          Creator_CustomUrl: "$tokenCreator.CustomUrl",
          Creator_WalletAddress: "$tokenCreator.WalletAddress",
          Creator_Profile: "$tokenCreator.Profile",
          Creator_Cover: "$tokenCreator.Cover",
          isStake: "$Tokens.tokenowners_list.isStake",
          SaleStatus: "$Tokens.tokenowners_list.SaleStatus",
 

          TokenOwner_Name: 1,

          // Counts: { $cond: { if: { $isArray: "$TokenOwnerDetails" }, then: { $size: "$TokenOwnerDetails" }, else: 0} }
        },
      },
    ];
    var Agg = await Aggregate({ Query: Query, DBName: DBName });
    Agg.from = "info-explore";
    return Agg;
  } catch (e) {
    //    // console.log(e)
    return { success: "error", msg: e.toString() };
  }
};

export const BidInfo = async (data, LimSkip) => {
  const { DBName, BidMatch, sort } = data;
  const { limit, skip } = LimSkip;
  var Query = [
    {
      $match: BidMatch,
    },
    {
      $sort: sort,
    },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "TokenBidderAddress",
        foreignField: "WalletAddress",
        as: "BidUsers",
      },
    },
    {
      $unwind: "$BidUsers",
    },
    {
      $project: {
        _id: 0,
        TokenBidAmt: 1,
        TokenBidderAddress: 1,
        NFTId: 1,
        status: 1,
        ContractAddress: 1,
        ContractType: 1,
        HashValue: 1,
        CoinName: 1,
        NFTQuantity: 1,
        Completed: 1,
        Pending: 1,
        updatedAt: 1,
        DisplayName: { $cond: { if: { $ne: ["$BidUsers.DisplayName", ''] }, then: "$BidUsers.DisplayName", else: { $concat: [{ $substr: ["$BidUsers.WalletAddress", 0, 3] }, "...", { $substr: ["$BidUsers.WalletAddress", 39, -1] }] } } },
        // DisplayName: "$BidUsers.DisplayName",
        EmailId: "$BidUsers.EmailId",
        // CustomUrl: "$BidUsers.CustomUrl",
        Profile: "$BidUsers.Profile",
        Cover: "$BidUsers.Cover",
        WalletAddress: "$BidUsers.WalletAddress",
        CustomUrl: "$BidUsers.CustomUrl",
      },
    },
  ];
  var Agg = await Aggregate({ Query: Query, DBName: DBName });
  Agg.from = "Bid";
  return Agg;
};
export const FollowUnFollowList = async (data, SendDta) => {
  const {
    Follow_Initial_Match,
    usermatchAdd,
    usermatchPro,
    unwind,
    from,
    fromTable,
  } = data;
  const { limit, skip } = SendDta;
  try {
    var Query = [
      {
        $match: Follow_Initial_Match,
      },
      { $sort: { updatedAt: -1 } },
      { $unwind: unwind },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: "users",
          let: { ad: usermatchAdd, pr: usermatchPro },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$WalletAddress", "$$ad"] },
                  ],
                },
              },
            },
          ],
          as: "tokenowners_user",
        },
      },
      {
        $unwind: {
          path: "$tokenowners_user",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $project: {
          _id: 0,
          DisplayName: { $cond: { if: { $ne: ["$tokenowners_user.DisplayName", ''] }, then: "$tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_user.WalletAddress", 39, -1] }] } } },
          ProfileUrl: "$tokenowners_user.ProfileUrl",
          CustomUrl: "$tokenowners_user.CustomUrl",
          WalletAddress: "$tokenowners_user.WalletAddress",
          Profile: "$tokenowners_user.Profile",
        },
      },
    ];
    var Agg = await Aggregate({ Query: Query, DBName: fromTable });
    Agg.from = from;

    return Agg;
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};

export const MyItemList = async (data) => {
  const {
    ProfileUrl,
    limit,
    skip,
    fromMatch,
    sort,
    refMatch,
    from,
    fromTable,
    refTable,
    // sort1
  } = data;

  try {
    var Query = [
      {
        $match: fromMatch,
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      // { $sort: sort1 },


      {
        $lookup: {
          from: "users",
          let: { proName: "$NFTOwner" },
          pipeline: [
            { $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } } },
          ],
          as: "tokenowners_user",
        },
      },
      {
        $unwind: {
          path: "$tokenowners_user",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: refTable,
          let: { tId: "$NFTId",collname:"$CollectionName" },
          pipeline: [{ $match: refMatch }],
          as: "tokenowners_list",
        },
      },
      { $unwind: "$tokenowners_list" },

      {
        $lookup: {
          from: "users",
          localField: "tokenowners_list.NFTCreator",
          foreignField: "WalletAddress",
          // pipeline: [{ $match: refMatch }],
          as: "tokencreator_list",
        },
      },
      { $unwind: "$tokencreator_list" },


      {
        $project: {
          _id: 1,
          NFTId: 1,
          NFTOwner: 1,
          HashValue: 1,
          PutOnSale: 1,
          PutOnSaleType: 1,
          NFTPrice: 1,
          CoinName: 1,
          NFTQuantity: 1,
          NFTBalance: 1,
          ClockTime: 1,
          EndClockTime: 1,
          updatedAt: 1,
          Creator_DisplayName: "$tokencreator_list.DisplayName",
          Creator_CustomUrl: "$tokencreator_list",
          Creator_WalletAddress: "$tokencreator_list",
          Creator_Cover: "$tokencreator_list",
          Creator_Profile: "$tokencreator_list",
          NFTName: "$tokenowners_list.NFTName",
          fileType: "$tokenowners_list.fileType",
          tokenowners_list: "$tokenowners_list",
          tokencreator_list: "$tokencreator_list",
          NFTOrginalImage: "$tokenowners_list.NFTOrginalImage",
          NFTThumpImage: "$tokenowners_list.NFTThumpImage",
          CompressedFile: "$tokenowners_list.CompressedFile",
          CompressedThumbFile: "$tokenowners_list.CompressedThumbFile",
          ContractAddress: "$tokenowners_list.ContractAddress",
          ContractType: "$tokenowners_list.ContractType",
          ContractName: "$tokenowners_list.ContractName",
          NFTCreator: "$tokenowners_list.NFTCreator",
          CollectionNetwork: "$tokenowners_list.CollectionNetwork",
          isStake: "$tokenowners_list.isStake",
          SaleStatus: 1,
          
          // Counts: { $cond: { if: { $isArray: "$NFTOwnerDetails" }, then: { $size: "$NFTOwnerDetails" }, else: 0} }
          DisplayName: { $cond: { if: { $ne: ["$tokenowners_user.DisplayName", ''] }, then: "$tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_user.WalletAddress", 39, -1] }] } } },

          // DisplayName: "$tokenowners_user.DisplayName",
          ProfileUrl: "$tokenowners_user.ProfileUrl",
          CustomUrl: "$tokenowners_user.CustomUrl",

          WalletAddress: "$tokenowners_user.WalletAddress",
          Owner_Profile: "$tokenowners_user.Profile",
          Cover: "$tokenowners_user.Cover",
        },
      },
    ];

    var Agg = await Aggregate({ Query: Query, DBName: fromTable });
    Agg.from = from;

    return Agg;
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};


/**
 * My Item - User Collection
 */

export const UserCollection = async (data) => {
  try {
    // const serverUrl = Config.MoralisserverUrl;
    // const appId = Config.MoralisappId;

    await Moralis.start({ apiKey: '7der1dQRSk65bs7oAyX6yaUesqkAixUCaRIRUoPtrA81jj812fpvu4lUTXIj9in9' });
    var NFTs = await Moralis.EvmApi.nft.getWalletNFTs(data);

    var resdata = await getUri(NFTs?.data?.result);
    var All_data = {
      success: resdata.length > 0 ? "success" : "error",
      msg: "OK",
      data: resdata,
      cursor: NFTs?.data?.cursor
    }
    return All_data
  }
  catch (e) {
    return false
  }
}



const getUri = async (data) => {
  var nftdata = [];

  try {

    if (data.length > 0) {
      await Promise.all(data.map(async item => {
        if (item.metadata) {
          var tokenuri = JSON.parse(item.metadata)?.image
          var token_name = JSON.parse(item.metadata)?.name
          var ipfsurl = Config.IPFS_IMG
          if ((tokenuri.includes("ipfs://")) || (tokenuri.includes("ipfs:/")) || (tokenuri.includes("ipfs/"))) {
            var spliturl = (((tokenuri).split("ipfs://").pop()).split("ipfs/").pop()).split("ipfs:/").pop()
            var tokenuri = ipfsurl + spliturl;
          }
          else {
            var tokenuri = tokenuri;
          }
          var path = tokenuri
        }
        var initialdata = {
          colladdress: item.token_address,
          title: item.name,
          name: token_name,
          image: path,
          amount: item.amount,
          owner: item.owner_of,
          tokenCounts: item.token_id,
          type: item.contract_type,
          // cursor  : cursor
        }
        nftdata.push(initialdata)
      }))

    }
    return nftdata;
  } catch (err) {
    return []
  }
}


export const TopCreator = async (data) => {
  const { sort, match } = data
  var Query = [
    { $match: match },
    {
      $sort: sort,
    },
    { $limit: 12 },
    {
      $group: {
        _id: '$To',
        value: {
          $sum: {
            $multiply: [
              {
                $toDouble: "$NFTPrice",
              },
              {
                $toInt: "$NFTQuantity",
              },
            ],
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        let: { to: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$WalletAddress', '$$to'] }
            }
          }],
        as: 'user'
      }
    }
    , { $unwind: '$user' },
    {
      $project: {
        DisplayName: '$user.DisplayName',
        WalletAddress: '$user.WalletAddress',
        Profile: '$user.Profile',
        value: '$value',
        CustomUrl: "$user.CustomUrl",
        Facebook: "$user.Facebook",
        Twitter: "$user.Twitter",
        Instagram: "$user.Instagram"
      }
    }

  ]
  var Agg = await Aggregate({ Query: Query, DBName: ActivitySchema });
  Agg.from = "Top Creator";
  return Agg;
}

export const TopBuyerCreator = async (data) => {
  const { sort, match } = data
  var Query = [
    { $match: match },

    {
      $group: {
        _id: '$To',
        count: { $sum: 1 }
      }
    },
    {
      $sort: sort,
    },
    { $limit: 12 },
    {
      $lookup: {
        from: 'users',
        let: { to: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$WalletAddress', '$$to'] }
            }
          }],
        as: 'user'
      }
    }
    , { $unwind: '$user' },
    {
      $project: {
        DisplayName: '$user.DisplayName',
        WalletAddress: '$user.WalletAddress',
        Profile: '$user.Profile',
        // value : '$value',
        CustomUrl: "$user.CustomUrl",
        Facebook: "$user.Facebook",
        Twitter: "$user.Twitter",
        Instagram: "$user.Instagram",
        noofnfts: "$count"
      }
    }

  ]
  var Agg = await Aggregate({ Query: Query, DBName: ActivitySchema });
  Agg.from = "Top Buyer";
  return Agg;
}

export const HomeCollectionFunc = async (data) => {
  const { sort, match, CollLimit, limit, DBNAME, tokenMatch, tab } = data
  var Query = [
    { $match: match },
    { $limit: CollLimit },
    { $sort: { 'updatedAt': (tab == "old") ? 1 : -1 } },
    {
      $lookup: {
        from: 'users',
        let: { create: "$CollectionCreator" },
        pipeline: [
          { $match: { $expr: { $eq: ['$WalletAddress', '$$create'] } } },
          { $limit: 1 },
          {
            $project: {
              DisplayName: 1,
              CustomUrl: 1
            }
          }
        ],
        as: 'User'
      }
    },
    { $unwind: '$User' },
    {
      $lookup: {
        from: 'tokens',
        let: { symbol: "$CollectionSymbol" },
        pipeline: [
          { $match: tokenMatch },
          { $limit: limit },
          { $sort: sort },
          {
            $project: {
              NFTName: 1,
              NFTOrginalImage: 1,
              NFTThumpImage: 1,
              CompressedFile: 1,
              CompressedThumbFile: 1,
            }
          }
        ],
        as: 'Tokens'
      }
    },
    {
      $project: {
        CollectionName: 1,
        CollectionProfileImage: 1,
        CollectionSymbol: 1,
        CollectionType: 1,
        Category: 1,
        CollectionNetwork: 1,
        CollectionCreator: 1,
        Tokens: '$Tokens',
        DisplayName: '$User.DisplayName',
        CustomUrl: '$User.CustomUrl',
        CollectionCount: { $cond: { if: { $isArray: "$Tokens" }, then: { $size: "$Tokens" }, else: 0 } }
      }
    }

  ]
  var Agg = await Aggregate({ Query: Query, DBName: DBNAME });
  Agg.from = "Top Creator";
  return Agg;
}

export const ActivityList = async (data) => {
  const {
    limit,
    skip,
    sort,
    from,
    Tokens,
    TokenMatch
  } = data;
  //  console.log("crol",data)
  try {
    var Query = [
      {
        $match: TokenMatch,
      },

      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          let: { from: "$From" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $ne: ["$WalletAddress", ""],
                    },
                    {
                      $eq: ["$WalletAddress", "$$from"],
                    },
                  ],
                },
              },
            },
          ],
          as: "FromUsers",
        },
      },
      {
        $unwind: {
          path: "$FromUsers",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { to: "$To" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $ne: ["$WalletAddress", ""],
                    },
                    {
                      $eq: ["$WalletAddress", "$$to"],
                    },
                  ],
                },
              },
            },
          ],
          as: "ToUsers",
        },
      },
      {
        $unwind: {
          path: "$ToUsers",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tokens",
          let: {
            tokenId: "$NFTId",
            contractAddress: "$ContractAddress",
            collectionNetwork: "$CollectionNetwork",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$NFTId", "$$tokenId"] },
                    { $eq: ["$CollectionNetwork", "$$collectionNetwork"] },
                    { $eq: ["$ContractAddress", "$$contractAddress"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                NFTName: 1,
                Category: 1,
                NFTOrginalImage: 1,
                NFTThumpImage: 1,
                NFTOrginalImageIpfs: 1,
                NFTThumpImageIpfs: 1,
                NFTCreator: 1,
                CompressedFile: 1,
                CompressedThumbFile: 1,
              },
            },
          ],
          as: "Tokens",
        },
      },
      { $unwind: { path: "$Tokens", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          TokenId: '$NFTId',
          TokenName: "$Tokens.NFTName",
          Category: 1,
          OriginalFile: "$Tokens.OriginalFile",
          OriginalThumbFile: "$Tokens.OriginalThumbFile",
          CompressedFile: "$Tokens.CompressedFile",
          CompressedThumbFile: "$Tokens.CompressedThumbFile",
          ContractAddress: 1,
          ContractType: 1,
          ContractName: 1,
          CollectionNetwork: 1,
          updatedAt: 1,
          usd: 1,
          Activity: 1,
          Creator: "$Tokens.NFTCreator",
          NFTPrice: 1,
          CoinName: 1,
          NFTQuantity: 1,
          HashValue: 1,
          Type: 1,
          From: 1,
          From_Name: 1,
          From_Profile: "$FromUsers.Profile",
          From_CustomUrl: "$FromUsers.CustomUrl",
          From_DisplayName: { $cond: { if: { $ne: ["$FromUsers.DisplayName", ''] }, then: "$FromUsers.DisplayName", else: { $concat: [{ $substr: ["$FromUsers.WalletAddress", 0, 3] }, "...", { $substr: ["$FromUsers.WalletAddress", 39, -1] }] } } },

          // From_DisplayName: "$FromUsers.DisplayName",
          To: 1,
          To_Name: 1,
          To_Profile: "$ToUsers.Profile",
          To_CustomUrl: "$ToUsers.CustomUrl",
          To_DisplayName: { $cond: { if: { $ne: ["$ToUsers.DisplayName", ''] }, then: "$ToUsers.DisplayName", else: { $concat: [{ $substr: ["$ToUsers.WalletAddress", 0, 3] }, "...", { $substr: ["$ToUsers.WalletAddress", 39, -1] }] } } },

        },
      },
    ];
    var Agg = await Aggregate({ Query: Query, DBName: Tokens });
    // console.log("mukam katu ne ", JSON.stringify(Query));

    Agg.from = from;
    return Agg;
  } catch (e) {
    // console.log(e);
    return { success: "error", msg: e.toString() };
  }
};

export const CollectionList = async (data) => {
  const { sort, match, CollLimit, limit, DBNAME, tokenMatch, tab } = data
  var Query = [
    { $sort: { 'updatedAt': -1 } },
    {
      $lookup: {
        from: 'users',
        let: { create: "$Creator" },
        pipeline: [
          { $match: { $expr: { $eq: ['$WalletAddress', '$$create'] } } },
          { $limit: 1 },
          {
            $project: {
              DisplayName: 1,
              CustomUrl: 1
            }
          }
        ],
        as: 'User'
      }
    },
    { $unwind: '$User' },
    {
      $project: {
        collectionName: 1,
        profileImage: 1,
        CollectionSymbol: 1,
        collectionType: 1,
        Category: 1,
        CollectionNetwork: 1,
        Creator: 1,
        customUrl: 1,
        collectionType: 1,
        DisplayName: '$User.DisplayName',
        collectionCount: 1,
        bannerpromotion: 1,
        droppromotion: 1,
        stackpromotion:1
      }
    }

  ]
  var Agg = await Aggregate({ Query: Query, DBName: DBNAME });
  Agg.from = "Top Creator";
  return Agg;
}

export const PromotedTokens = async (data) => {
  try {
    const { DBName } = data
    var Query = [
      {
        // $match:{bannerpromotion:true}
        $match: {

          $expr: {
            $and: [
              {
                $eq: ["$bannerpromotion", true],
              },
              {
                $eq: ["$Status", "list"],
              },
            ],
          }
        }
      },
      { $sort: { updatedAt: -1 } },
      { $limit: 2 },
      {
        $lookup: {
          from: "tokens",
          localField: "NFTId",
          foreignField: "NFTId",
          as: "NFT"
        }
      },
      { $unwind: "$NFT" },
      {
        $lookup: {
          from: "users",
          localField: "NFTOwner",
          foreignField: "WalletAddress",
          as: "userdetail"
        }
      },
      { $unwind: "$userdetail" },
      {
        $project: {
          _id: "$NFT._id",
          NFTId: "$NFT.NFTId",
          NFTName: "$NFT.NFTName",
          NFTOrginalImage: "$NFT.NFTOrginalImage",
          NFTThumpImage: "$NFT.NFTThumpImage",
          CompressedFile: "$NFT.CompressedFile",
          CompressedThumbFile: "$NFT.CompressedThumbFile",
          ContractAddress: "$NFT.ContractAddress",
          ContractType: "$NFT.ContractType",
          ContractName: "$NFT.ContractName",
          NFTCreator: "$NFT.NFTCreator",
          NFTRoyalty: "$NFT.NFTRoyalty",
          updatedAt: "$NFT.updatedAt",
          CollectionNetwork: "$NFT.CollectionNetwork",
          CollectionName: "$NFT.CollectionName",
          NFTOwner: 1,
          EndClockTime: 1,
          // DisplayName: "$tokenowners_list.tokenowners_user.DisplayName",
          CustomUrl: "$userdetail.CustomUrl",

          Creator_DisplayName: "$userdetail.DisplayName",
          Creator_CustomUrl: "$userdetail.CustomUrl",
          Creator_WalletAddress: "$userdetail.WalletAddress",
          Creator_Profile: "$userdetail.Profile",
          Creator_Cover: "$userdetail.Cover",
          fileType: "$NFT.fileType",
          // Counts: { $cond: { if: { $isArray: "$TokenOwnerDetails" }, then: { $size: "$TokenOwnerDetails" }, else: 0} }
        },
      },
    ];
    var Agg = await Aggregate({ Query: Query, DBName: DBName });
    return Agg;
  }
  catch (err) {
    // console.log('PromotedTokens errrrror')
    return ({ success: 'error', data: null });
  }
}

export const PromotedCollections = async (data) => {
  try {
    const { DBName, from } = data;
    var Query = [
      {
        $match: { [from]: true }
      },
      { $sort: { _id: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "users",
          localField: "Creator",
          foreignField: "WalletAddress",
          as: "userdetail"
        }
      },
      { $unwind: "$userdetail" },
      {
        $project: {
          _id: 1,
          Creator: 1,
          collectionType: 1,
          profileImage: 1,
          customUrl: 1,
          Creator_DisplayName: "$userdetail.DisplayName",
          collectionName: 1,
          isStakeable: 1,
          floorPrice:1,
          isImported: {
            $cond: { if: { $eq: ["$isImported", true] }, then: true, else: false }
          }
        }
      }
    ]
    var Agg = await Aggregate({ Query: Query, DBName: DBName });
    return Agg;
  } catch (err) {
    console.log('PromotedCollections error', err)
  }
}

// cloned above written Tokenlist function for explore page in xdseanft -- removed sort section






export const ExploreTokenList_category = async (data) => {
  const {
    ProfileUrl,
    limit,
    skip,
    tokenOwnerMatch,
    sort,
    TokenMatch,
    from,
    Tokens,
    TabName,
  } = data;

  // console.log("tokenOwnerMatch,sort",JSON.stringify(tokenOwnerMatch),sort)

  try {
    var Query = [
      {
        $match: TokenMatch,
      },
      {
        $lookup: {
          from: "users",
          let: { proName: "$NFTCreator" },
          pipeline: [
            { $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } } },
          ],
          as: "tokenCreator",
        },
      },
      {
        $unwind: {
          path: "$tokenCreator",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "tokenowners",
          let: { tId: "$NFTId" ,collname:"$CollectionName"},
          pipeline: [
            { $match: tokenOwnerMatch },

            {
              $lookup: {
                from: "users",
                let: { proName: "$NFTOwner" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } },
                  },
                ],
                as: "tokenowners_user",
              },
            },
            {
              $unwind: {
                path: "$tokenowners_user",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "tokenowners_list",
        },
      },
      { $unwind: "$tokenowners_list" },

      // { $sort: sort },
      { $skip: parseInt(skip) },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          NFTId: 1,
          NFTName: 1,
          NFTOrginalImage: 1,
          NFTThumpImage: 1,
          CompressedFile: 1,
          CompressedThumbFile: 1,
          ContractAddress: 1,
          ContractType: 1,
          ContractName: 1,
          NFTCreator: 1,
          Category: 1,
          NFTRoyalty: 1,
          updatedAt: 1,
          CollectionNetwork: 1,
          fileType: 1,
          NFTOwner: "$tokenowners_list.NFTOwner",
          HashValue: "$tokenowners_list.HashValue",
          PutOnSale: "$tokenowners_list.PutOnSale",
          PutOnSaleType: "$tokenowners_list.PutOnSaleType",
          NFTPrice: "$tokenowners_list.NFTPrice",
          CoinName: "$tokenowners_list.CoinName",
          NFTQuantity: "$tokenowners_list.NFTQuantity",
          NFTBalance: "$tokenowners_list.NFTBalance",
          ClockTime: "$tokenowners_list.ClockTime",
          EndClockTime: "$tokenowners_list.EndClockTime",
          DisplayName: { $cond: { if: { $ne: ["$tokenowners_list.tokenowners_user.DisplayName", ''] }, then: "$tokenowners_list.tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_list.tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_list.tokenowners_user.WalletAddress", 39, -1] }] } } },
          tokenowners_list_count: '$tokenowners_list_count',
          // DisplayName: "$tokenowners_list.tokenowners_user.DisplayName",
          CustomUrl: "$tokenowners_list.tokenowners_user.CustomUrl",
          WalletAddress: "$tokenowners_list.tokenowners_user.WalletAddress",
          Owner_Profile: "$tokenowners_list.tokenowners_user.Profile",
          Cover: "$tokenowners_list.tokenowners_user.Cover",
          Creator_DisplayName: { $cond: { if: { $ne: ["$tokenCreator.DisplayName", ''] }, then: "$tokenCreator.DisplayName", else: { $concat: [{ $substr: ["$tokenCreator.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenCreator.WalletAddress", 39, -1] }] } } },

          Creator_DisplayName: "$tokenCreator.DisplayName",
          Creator_CustomUrl: "$tokenCreator.CustomUrl",
          Creator_WalletAddress: "$tokenCreator.WalletAddress",
          Creator_Profile: "$tokenCreator.Profile",
          Creator_Cover: "$tokenCreator.Cover",
          TokenOwner_Name: "$tokenowners_list.TokenOwner_Name",
          bannerpromotion: "$tokenowners_list.bannerpromotion",
          isStake: "$tokenowners_list.isStake",
          isStakeable: "$tokenowners_list.isStakeable",
          backedValue: "$tokenowners_list.backedValue",
          SaleStatus: "$tokenowners_list.SaleStatus"

 
          // Counts: { $cond: { if: { $isArray: "$TokenOwnerDetails" }, then: { $size: "$TokenOwnerDetails" }, else: 0} }
        },
      },
    ],
      Query_Count = [
        {
          $match: TokenMatch,
        },

        {
          $lookup: {
            from: "tokenowners",
            let: { tId: "$NFTId" },
            pipeline: [
              { $match: tokenOwnerMatch },
            ],
            as: "tokenowners_list",
          },
        },

        {
          $project: {
            _id: 0,
            tokenowners_list: "$tokenowners_list"
          },
        },
      ];

 
    //  console.log("console query=====",JSON.stringify(Query))
    var Agg = await Aggregate({ Query: Query, DBName: Tokens });
    //  console.log("Query Result",Agg.data.length)
 
    Agg.from = from;
    Agg.Count = 0

    return Agg;
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};

export const ExploreTokenList = async (data) => {
  const {
    ProfileUrl,
    limit,
    skip,
    tokenOwnerMatch,
    sort,
    TokenMatch,
    from,
    Tokens,
    TabName,
  } = data;

  // console.log("tokenOwnerMatch,sort",JSON.stringify(tokenOwnerMatch),sort)



  try {
    var Query = [
      {
        $match: tokenOwnerMatch,
      },
      {
        $lookup: {
          from: "users",
          let: { proName: "$NFTOwner" },
          pipeline: [
            { $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } } },
          ],
          as: "tokenowners_user",
        },
      },
      {
        $unwind: {
          path: "$tokenowners_user",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: sort },
      {
 
        "$skip": parseInt(skip)
 
      },
      {
        "$limit": limit
      },
      {
        "$lookup": {
          "from": "tokens",
          "let": {
 
            "nftid": "$NFTId",
            "collname":"$CollectionName"
 
          },
          "pipeline": [
            {
              "$match": TokenMatch
            }

          ],
          "as": "tokens_detail"
        }
      },
      {
        "$unwind": {
          "path": "$tokens_detail",
          "preserveNullAndEmptyArrays": true
        }
      },

      {
        $project: {
          _id: 1,
          "NFTId": "$tokens_detail.NFTId",
          "NFTName": "$tokens_detail.NFTName",
          "NFTOrginalImage": "$tokens_detail.NFTOrginalImage",
          "NFTThumpImage": "$tokens_detail.NFTThumpImage",
          "CompressedFile": "$tokens_detail.CompressedFile",
          "CompressedThumbFile": "$tokens_detail.CompressedThumbFile",
          "ContractAddress": "$tokens_detail.ContractAddress",
          "ContractType": "$tokens_detail.ContractType",
          "ContractName": "$tokens_detail.ContractName",
          "NFTCreator": "$tokens_detail.NFTCreator",
          "Category": "$tokens_detail.Category",
          "NFTRoyalty": "$tokens_detail.NFTRoyalty",
          "updatedAt": 1,
          "CollectionNetwork": "$tokens_detail.CollectionNetwork",
          "fileType": "$tokens_detail.fileType",
          NFTOwner: 1,
          HashValue: 1,
          PutOnSale: 1,
          PutOnSaleType: 1,
          NFTPrice: 1,
          CoinName: 1,
          NFTQuantity: 1,
          NFTBalance: 1,
          ClockTime: 1,
          EndClockTime: 1,
          DisplayName: { $cond: { if: { $ne: ["$tokenowners_user.DisplayName", ''] }, then: "$tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_user.WalletAddress", 39, -1] }] } } },
          tokenowners_list_count: '$tokenowners_list_count',
          // DisplayName: "$tokenowners_list.tokenowners_user.DisplayName",
          CustomUrl: "$tokenowners_user.CustomUrl",
          WalletAddress: "$tokenowners_user.WalletAddress",
          Owner_Profile: "$tokenowners_user.Profile",
          Cover: "$tokenowners_user.Cover",
          // Creator_DisplayName:  { $cond: { if: { $ne:["$tokenCreator.DisplayName",'']},then : "$tokenCreator.DisplayName" , else : {$concat: [ { $substr: [  "$tokenCreator.WalletAddress" ,0, 3 ] } , "...",  { $substr: [  "$tokenCreator.WalletAddress" , 39,-1] } ] }}},

          // Creator_DisplayName: "$tokenCreator.DisplayName",
          // Creator_CustomUrl: "$tokenCreator.CustomUrl",
          Creator_WalletAddress: "$tokens_detail.NFTCreator",
          // Creator_Profile: "$tokenCreator.Profile",
          // Creator_Cover: "$tokenCreator.Cover",
          TokenOwner_Name: "$tokenowners_list.TokenOwner_Name",
          bannerpromotion: 1,
          isStake: 1,
          isStakeable: 1,
 
          backedValue: 1,
          SaleStatus:1
 
          // Counts: { $cond: { if: { $isArray: "$TokenOwnerDetails" }, then: { $size: "$TokenOwnerDetails" }, else: 0} }
        },
      },
    ]

    //  console.log("all============",JSON.stringify(Query))

    var Agg = await Aggregate({ Query: Query, DBName: TokenOwners });
    //  console.log("Query Result",Agg)
    Agg.from = from;
    Agg.Count = 0

    return Agg;
  } catch (e) {
    //  console.log("Query Error",e)
    return { success: "error", msg: e.toString() };
  }
};

