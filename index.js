const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require('./util/ExpressError');


const listingHome = require("./routes/listingHome");
const reviews = require('./routes/review');

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json())




main().then(() => {
    console.log("Database Connect..........");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}



app.use("/" , listingHome);
app.use("/:id/reviews", reviews)

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