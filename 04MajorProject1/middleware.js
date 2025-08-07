const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.user);
    // console.log(req);
    // console.log(req.path,"..",req.originalUrl);
     if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;  //jis path per jaane ki koshis kar rahe but login mid me  aagay to us path ka url
        req.flash("error","you must be looged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){  
        res.locals.redirectUrl=req.session.redirectUrl
        //we save it into  res.local bcz when we login passport reser req.session so redirect url bhi empty ho jayagi so we save it before login
        //by using this middle ware in login requset
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewOwner=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review")
        return res.redirect(`/listings/${id}`);
    }
    next();
}