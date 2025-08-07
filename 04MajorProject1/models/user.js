const { required } = require("joi");
const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
});

userSchema.plugin(passportLocalMongoose) 
//ye username ,salt and passwaord(hash) with salt and hasing ke saath add kardega



module.exports=mongoose.model("User",userSchema);