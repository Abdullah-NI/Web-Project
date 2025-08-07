const User=require("../models/user");

module.exports.renderSignUpForm=(req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newsUser = new User({ email, username });
        let registeredUser = await User.register(newsUser, password);
        req.login(registeredUser, (err) => {  //res.login use for login directly when sign up
            if (err) {
                return next(err);
            }
            req.flash("success", "welcom to Wanderlust");
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    //tyr catch iskiye use kara if username already exit hia 
    //to error throe hoga ,so hamne here tyr catch use karke flash kara diya
}


module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
}

module.exports.login=async (req, res) => {
    // res.send("welcome to wanderlust! you are logged in!")
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
}