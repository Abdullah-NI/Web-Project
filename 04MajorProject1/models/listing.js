const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");


const listingSchema=new Schema({
    title: {
        type:String,
        required: true
    },
    description:String,
    image:{
        // type:String,
        // default:"https://plus.unsplash.com/premium_photo-1747326386378-5635788ea82c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8",
        // set:(v)=> v===""?"https://plus.unsplash.com/premium_photo-1747326386378-5635788ea82c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8":v,
        url:String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
       type: {
        type: String,
        enum: ['Point'],
        required: true
        },
        coordinates: {
        type: [Number],
        required: true
        } 
    },
    category:{
        type:String,
        enum:["Trending","Rooms","Iconic Cities","Mountain","Castles","Amazing pool","Camping","Farms","Arctic","Domes","Boats"]
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews }})
    }
})

const Listing=mongoose.model("Listing",listingSchema)

module.exports=Listing;

