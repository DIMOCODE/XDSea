
import mongoose from  'mongoose';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({

    name: {
        
        type: String,
        required:true
    },
    description : {
        
        type: String,
        // required:true
        default:""
    },
    hideShow : {
        
        type: String,
        default:"visible"
    },
    image:{
        type: String,
        required:true 
    }
  
  
})


const Category = mongoose.model("category", CategorySchema, "category");
export default Category;