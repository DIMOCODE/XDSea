import mongoose, { Schema,model } from "mongoose";

  const StakingPoolSchema = new Schema({
    collectionId: {
      type: Schema.Types.ObjectId,
      // ref: "Collection",
      ref: "usercollections",

    },
    lockPeriod: {
      type: Number,
    },
    isBackedValue: {
      type: Boolean,
    },
    backedValuesAmount: {
      type: Number,
    },
    walletAddress: {
      type: String,
    },

    rewardRates: [
      new Schema({
        rewardTypeId: {
          type: Schema.Types.ObjectId,
          ref: "RewardType",
        },
        amount: {
          type: Number,
        },
        rewardFrecuency: {
          type: Number,
        },
      }),
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });


  export default mongoose.model('StakingPool',StakingPoolSchema)
 
