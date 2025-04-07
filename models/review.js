const mongoose=require("mongoose");

const revieSchema=new mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    },
});

module.exports=mongoose.model("Review",revieSchema);