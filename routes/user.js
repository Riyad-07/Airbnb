const express = require("express");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const { saveUrl } = require("../middleware");
const router = express.Router();

const userController = require("../controllers/user");


// ------------------------------------------------------> register route

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})


router.post("/signup", wrapAsync(userController.newSignup))

// ----------------------------------------------------------------------------> login Route

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

router.post("/login", saveUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.logIn)

// ----------------------------------------------------------------> Log Out Route

router.get("/logout", userController.logOut)

module.exports = router