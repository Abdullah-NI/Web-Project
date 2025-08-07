if(process.env.NODE_ENV !="production"){
require('dotenv').config()
}
// console.log(process.env.SECRET) 
// console.log(process.env.secret) 

const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");  //which are fade you can cut them because these are not use in this file now
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("./schemaValidation.js")
// const Review=require("./models/review.js");  
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
 
app.use(express.static(path.join(__dirname,"public")))

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl=process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(MONGO_URL)
}
main()
.then(()=>{
    console.log("connected to db")
})
.catch(err=>{ 
    console.log(err)
})

const store=MongoStore.create({
    mongoUrl:MONGO_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*60*60,
})
store.on("error",()=>{
    console.log("Error in Mongo session store",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }, 
};

app.get("/",(req,res)=>{ 
    res.redirect("/listings")
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //now user not neccessary to login again and again for every 
                            //request for same session
passport.use(new LocalStrategy(User.authenticate())); //it handles that username is already exit or not ,and match the password while loging
passport.serializeUser(User.serializeUser());  //When a user logs in, Passport will serialize the user’s ID and store it in the session (like req.session.passport.user = user._id).
passport.deserializeUser(User.deserializeUser()); //When a request comes in, Passport reads the ID from the session and uses this function to fetch the full user object from the database and attach it to req.user.
// Summary Flow:
// when User logs in → passport.use(...) uses User.authenticate() to verify.

// If successful → serializeUser() stores user._id in session.

// On future requests → deserializeUser() finds the full user from user._id and puts it into req.user.




app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error") 
    console.log(res.locals.success); 
    res.locals.currUser=req.user;
    // console.log(res.locals.error); 
    next(); 
})

 


// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student2@gmail.com",
//         username:"My-student 2",
//     });
//     const registeredUser= await User.register(fakeUser,"password123")
//     res.send(registeredUser);
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
 



app.all("/{*any}", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});
 
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err 
    // console.log(err)
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message);
    // res.send("somthing went wrong")
})


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})  

