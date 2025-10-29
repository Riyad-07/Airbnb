const express = require("express");
const User = require("../modals/user");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const { saveUrl } = require("../middleware");
const router = express.Router();



// ------------------------------------------------------> register route

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})


router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let regUser = await User.register(newUser, password);
        req.login(regUser, (err)=>{
            if(err){
                return next(err)
            }            
            req.flash("success", "Succesfully Register");
            res.redirect("/")
        })
        
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }

}))

// ----------------------------------------------------------------------------> login Route

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

router.post("/login", saveUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Login Successfull");
    let finalUrl = res.locals.newUrl || "/";
    res.redirect(finalUrl);
})

// ----------------------------------------------------------------> Log Out Route

router.get("/logout", (req, res, next) => {
    req.logOut((err)=> {
        if(err){
            return next(err);
        }
        req.flash("success", "Log Out Successfull");
        res.redirect("/")
    })
})

module.exports = router