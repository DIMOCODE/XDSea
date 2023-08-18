import mongoose, { Schema,model } from "mongoose";

  const StakeSchema = new Schema({
    nftId: {
      type: Schema.Types.ObjectId,
      ref: "tokenowners",
    },
    stakingPoolId: {
      type: Schema.Types.ObjectId,
      ref: "StakingPool",
    },

    isWithdraw: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    stopedAt: {
      type: Date,
    },
  });
 
 
  export default mongoose.model('Stake',StakeSchema)
 
