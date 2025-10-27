const express = require("express");
const User = require("../modals/user");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
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
        console.log(regUser);
        req.flash("success", "Succesfully Register");
        res.redirect("/")
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }

}))

// ----------------------------------------------------------------------------> login Route

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

router.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Login Successfull");
    res.redirect("/")
})

module.exports = router