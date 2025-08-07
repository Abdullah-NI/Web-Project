const Listing=require("../models/listing");
const ExpressError=require("../utils/ExpressError.js")

const axios = require('axios');

const GEOAPIFY_KEY = 'bf9b11ffdc6841a4a364e4d2c2b7060c';

async function getCoordinates(address) {
  const url = `https://api.geoapify.com/v1/geocode/search`;
  
  const response = await axios.get(url, {
    params: {
      text: address,
      apiKey: GEOAPIFY_KEY
    }
  });

  const result = response.data.features[0];
  return result.geometry;
//   return {
//     lat: result.geometry.coordinates[1],
//     lng: result.geometry.coordinates[0]
//   };
}


module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({})
    res.render("listing/index.ejs",{allListings})
}

module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);  loggin user ki info store hai
    res.render("listing/new.ejs")
}
      
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    // let listing=await Listing.findById(id)
    // let listing=await Listing.findById(id).populate("reviews").populate("owner");
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exit");
        return res.redirect("/listings")
    }
    //to add map for existing location
    // console.log(listing)
    console.log(listing.geometry.coordinates.length)
    if(!listing.geometry.coordinates.length){
    const geometry = await getCoordinates(listing.location);
    listing.geometry=geometry;
    let saveListing= await listing.save()
    // console.log(saveListing);
    }

    // console.log(listing)
    res.render("listing/show.ejs",{listing})
}

module.exports.createListing=async(req,res)=>{
        //let{title,description,image,price,country,location}=req.body
        // res.send("hhh")
        let url=req.file.path;
        let filename=req.file.filename
        // console.log(req.file)
        // console.log(req.file.path)
        // console.log(req.file.filename)
        let listing=req.body.listing  //new object
        let newListing=new Listing(listing)  //ab ye model(collection ka ducument ban gaya hai)
        newListing.owner=req.user._id;
        newListing.image={url,filename};

        const geometry = await getCoordinates(listing.location);
        newListing.geometry=geometry;

        let saveListing= await newListing.save()
        console.log(saveListing);
        req.flash("success","New Listing Created")
        res.redirect("/listings")
};

module.exports.randerEditForm=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id)
    if(!listing){
       req.flash("error","Listing you requested for does not exit");
       return res.redirect("/listings");
    }
    let originalImage=listing.image.url;
    // console.log(originalImage)
    originalImage=originalImage.replace("/upload","/upload/h_200,w_250");//this for cloudnary image
    originalImage=originalImage.replace("format&fit=crop&w=800&q=60","format&fit=crop&w=250&h=200&q=60")//this for unsplash image jo already hai
    // console.log(originalImage)

    res.render("listing/edit.ejs",{listing,originalImage})
}

module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing")
    }
    let{id}=req.params;
    //let listing=await Listing.findById(id);
    // if(!listing.owner.equals(res.locals.currUser._id)){
    //     req.flash("error","you don't have permission to edit")
    //     return res.redirect(`/listings/${id}`);
    // }
    //we use middle ware for this checking
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
    // console.log(listing,"\n\n\n");
    if(typeof req.file !=="undefined"){
     let url=req.file.path;     
    let filename=req.file.filename
    listing.image={url,filename};
    await listing.save();
    // let uplisting= await listing.save();
    // console.log(uplisting,"\n\n\n");
    }
    req.flash("success","Listing Updated")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted")
    res.redirect("/listings")
}

module.exports.destinationListing=async(req,res)=>{
    let {country:desCountry}=req.query;
    // console.log(desCountry)
    let allListings=await Listing.find({country:desCountry})
    // console.log(allListings)
    if(allListings.length==0){
        req.flash("error",`listing not available on ${desCountry}`)
        return res.redirect("/listings")
    }
    res.render("listing/index.ejs",{allListings})
}

module.exports.categoryListing=async(req,res)=>{
    let {category}=req.query
    let allListings=await Listing.find({category:category})
    // console.log(allListings);
    // console.log(category)
    if(allListings.length==0){
        req.flash("error",`${category} Listing is not available `)
        return res.redirect("/listings")
    }
    res.render("listing/index.ejs",{allListings})
    
}