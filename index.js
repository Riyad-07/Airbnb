const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require('./util/ExpressError');
const session = require("express-session");
const flash = require("connect-flash")
const passport = require("passport");
const LocalStragegy = require("passport-local");
const User = require("./modals/user");


const listingHome = require("./routes/listingHome");
const reviews = require('./routes/review');
const userRouter = require('./routes/user');

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json())




main().then(() => {
    console.log("Database Connect..........");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

const sessionOption = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true, 
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}

// ------------------------------> Session

app.use(session(sessionOption))
app.use(flash())

// -----------------------------------------------------------------> Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStragegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// ----------------------------------------------------------> Demo User

// app.get("/demouser", async (req, res) => {
//     const fakeUser = new User({
//         email: "abc@gmail.com",
//         username: "Student"
//     })

//     let reguser = await User.register(fakeUser, "donttry")
//     res.send(reguser);
// })

app.use("/" , listingHome);
app.use("/:id/reviews", reviews)
app.use("/", userRouter);

// -----------------------------------------------------------> middleware for error handaling

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});





app.use((err, req, res, next) => {
    let { statusCode = 500, message = "someting wrong" } = err;
    res.render("err.ejs", { message })
    // res.status(statusCode).send(message);
})


app.listen(8080, () => {
    console.log("Server is running...........");
})