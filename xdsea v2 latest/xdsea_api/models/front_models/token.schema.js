import mongoose, { Schema,model } from "mongoose";
const NFTDetails  =   Schema( {
    NFTId                 :  {type:String,default:""},
    NFTName               :  {type:String,default:""},
    Category              :   {type:String,default:""},
    NFTOrginalImage         : {type:String,default:""},
    NFTThumpImage           : {type:String,default:""},
    NFTOrginalImageIpfs     : {type:String,default:""},
    NFTThumpImageIpfs       : {type:String,default:""},
    MetaData                : {type:String,default:""},
    CompressedFile          : {type:String,default:""},
    CompressedThumbFile     :  {type:String,default:""},
    UnlockContent           : {type:String,default:""},
    ContractAddress         : {type:String,default:""},
    ContractType            :  {type:Number,default:""},
    ContractName            :  {type:String,default:""},
    CollectionNetwork       :  {type:String,default:""},
    NFTRoyalty                 : {type:Number,default:""},
    // NFTProperties              :  [
    //                                     new Schema({
    //                                     property: {
    //                                         type: String,
    //                                     },
    //                                     value: {
    //                                         type: String,
    //                                     },
    //                                     rarity: {
    //                                         type: Number,
    //                                     },
    //                                     }),
    //                                 ],
    NFTProperties           :{type:Array,default:[]},
    NFTCreator                 : {type:String,default:""},
    isHidden                :  {type:Boolean,default:false},
    NFTQuantity            : {type:Number,default:""},
    reported                 :  {type:Boolean,default:false},  
    NFTDescription                :   {type:String,default:""},
    NFTOwner       : {type:String,default:""},
    likecount               :  {type:Number,default:""},
    ReportBy       :   [{
        Address:'',
        CustomUrl: '',
        Message:''
    }],
    CollectionName          : {type:String,default:""},
    isListed                :   {type:Boolean,default:false},  
    isReported                :   {type:Boolean,default:false},   /// listed status is maintained in "Status" field of tokenonwer table
    inBlacklist                :   {type:Boolean,default:false},
    HideShow                :   {   type : String , default : 'visible'}, 
    fileType                  :{   type : String , default : ''},
    CollectionSymbol          :   {   type : String , default : ''},
    MetFile          :   {   type : String , default : ''},
    isStakeable: {
        type: Boolean,
        default: false,
      },
    backedValue:{type:Number,default:0},
    previouslyListed        :  {type: Boolean,default: false},	
    marketAddress:            {type:String,default: ""},	
    hasOpenOffer            : {	
                                        type: Boolean,	
                                        default: false	
                              },	
    isWithdrawn:{	
        type: Boolean,	
        default: false,	
     }


    
   // createdAt               :  {type:Date},
    // updatedAt               :  {type:Date},


},{timestamps:true})

export default mongoose.model('tokens',NFTDetails)
