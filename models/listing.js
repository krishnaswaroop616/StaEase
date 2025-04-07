const mongoose=require("mongoose");
const Review=require("./review.js");

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2017/08/08/15/31/swedish-2611717_1280.jpg",
        set:(v)=>v===""?"https://cdn.pixabay.com/photo/2017/08/08/15/31/swedish-2611717_1280.jpg": v
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})


const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;