const express=require("express")
const router =express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schemaValidation.js")
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage})
//index
// router.get("/",wrapAsync(listingController.index))
//we create this request router .route see below


//create router

//using try and catch
// router.post("/listings",async(req,res)=>{
//     try{
//         // let{title,description,image,price,country,location}=req.body
//         let listing=req.body.Listing  //new object
//         let newListing=new Listing(listing)  //ab ye model(collection ka sucument ban gaya hai)
//         await newListing.save()
//         res.redirect("/listings")
//     }catch(err){
//         next(err);
//     }
// }) 



//create router
//using wrapAsync
// router.post("/listings",wrapAsync(async(req,res)=>{
//              // let{title,description,image,price,country,location}=req.body
//         let result=listingSchema.validate(req.body)
//         console.log(result)
//         console.log("\n\n\n\n",result.error)
//         console.log("\n\n\n\n",result.error.details)
//         if(result.error){
//             throw new ExpressError(400,result.error)
//         }
//              //if ham ye error through na karaye aur country location na dale and title dala
//              //to hamara item add ho jayge chuki hamne schema ne counrtry and location ko 
//              //required nhi banaya hai but ya joi ki help se inhe required banaya hai 
//              //isliye iski error through karane se wo add nhi hoga
//         let listing=req.body.listing  //new object

//         let newListing=new Listing(listing)  //ab ye model(collection ka ducument ban gaya hai)
//         await newListing.save()
//         res.redirect("/listings")
// }));


// creat router
// now we are using as middleware for schema validations
//chahe is middleware ko middleware file me add kardo and yaha require kar lo
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        console.log(errMsg)
        throw new ExpressError(400,errMsg)
    }
    else{
        next();  //required hai tabhi aage jayge ham
    }
}


// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing)); 
//using router.rout see in below

//index and //creat
router.route("/")  
    .get(wrapAsync(listingController.index))  
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing)); 
    // .post(upload.single('listing[image]'),(req,res)=>{
    //     res.send(req.file);
    // })



//new upper Liya so that not consider as :id
router.get("/new",isLoggedIn,listingController.renderNewForm) 
router.get("/destination",wrapAsync(listingController.destinationListing))
router.get("/category",wrapAsync(listingController.categoryListing))

//show ,update,delet router
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))


//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.randerEditForm))


module.exports=router;