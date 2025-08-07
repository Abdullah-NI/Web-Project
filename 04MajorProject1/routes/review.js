const express=require("express")
const router =express.Router({mergeParams:true});  //mergeparame :true to take parameter of parant route to chiled route means take id into this file which left behind
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schemaValidation.js")  //listingSchema not in use can cut
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const { isLoggedIn, isReviewOwner } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        console.log(errMsg)
        throw new ExpressError(400,errMsg)
    }
    else{
        next();  //required hai ye likhna , tabhi aage jayge ham
    }
}




//Reviews
//post Review rotue
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

 
//post review route
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(reviewController.destroyReview))


module.exports=router