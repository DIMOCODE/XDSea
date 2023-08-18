import mongoose, { Schema, model } from "mongoose";
const collectionDetails = Schema({

    isHidden: {
        type: Boolean,
        default: false,
    },
    volume: {
        type: Number,
        default: 0,
    },
    floorPrice: {
        type: Number,
        default: 0,
    },
    Bio: {
        type: String,
        default: ""
    },
    collectionCount: {
        type: Number,
        default: 0,
    },
    Creator: {
        type: String,
    },
    collectionType: {
        type: Number,
        default: 721
    },
    collectionName: {
        type: String,
        default: ""
    },
    customUrl: {
        type: String,
        default: ""
    },
    profileImage: {
        type: String,
        default: ""
    },
    BannerImage: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    }
    ,
    instagram: {
        type: String,
        default: ""
    }
    ,
    facebook: {
        type: String,
        default: ""
    }
    ,
    twitter: {
        type: String,
        default: ""
    }
    ,
    discord: {
        type: String,
        default: ""
    }
    ,
    contractAddress: {
        type: String,
        default: ""
    },
    importednfts: {
        type: Array,
        default: []
    }
    ,
    royalty: {
        type: Number,
        default: 0
    },
    bannerpromotion: {
        type: Boolean,
        default: false
    },
    droppromotion: {
        type: Boolean,
        default: false
    },
    stackpromotion: {
        type: Boolean,
        default: false
    }
    ,
    isImported: {
        type: Boolean,
        default: false
    }
    ,
    TimeStamp: {
        type: Date,
        default: Date.now()
    },
    isStakeable: {
        type: Boolean,
        default: false
    },
    hasRetroactiveRewards: {
        type: Boolean,
    }
    


})

export default mongoose.model('usercollections', collectionDetails)
