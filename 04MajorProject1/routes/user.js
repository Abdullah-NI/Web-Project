const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");
const { route } = require("./review.js");

// router.get("/signup",userController.renderSignUpForm );
// router.post("/signup", wrapAsync(userController.signup));
//ya
router.route("/signup")
    .get(userController.renderSignUpForm )
    .post( wrapAsync(userController.signup))


router.route("/login")
    .get(userController.renderLoginForm)
    .post( saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login );

router.get("/logout",userController.logout );

module.exports = router;