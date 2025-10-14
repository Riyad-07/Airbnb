const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./modals/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require('./util/wrapAsync');
const ExpressError = require('./util/ExpressError');
const { listingSchema } = require('./joiSchema');
const { error } = require('console');

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));




main().then(() => {
    console.log("Database Connect..........");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}


const validatedListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    }else{
        next();
    }
}


// ------------------------------------------------------> home route
app.get("/", wrapAsync(async (req, res) => {
    const alllist = await Listing.find()
    res.render("home.ejs", { alllist });
}))

// ----------------------------------------------------------> Add route

app.get("/add", (req, res) => {
    res.render("add.ejs")
})

app.post("/", validatedListing, wrapAsync(async (req, res) => {

    let list = await new Listing(req.body.listing)
    await list.save();
    res.redirect("/")

}))

// --------------------------------------------------------> edit route
app.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    res.render("edit.ejs", { list })
}))

app.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/${id}/view`);
}))

// ---------------------------------------------------> View Route

app.get("/:id/view", wrapAsync(async (req, res) => {
    let { id } = req.params
    let list = await Listing.findById(id);
    res.render("view.ejs", { list })
}))

// -----------------------------------------------------> Delete Route

app.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/")
}))

// -----------------------------------------------------------> middleware for error handaling

app.all("/", (req, res, next) => {
    next(new ExpressError(404, "Page not found"))
})


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "someting wrong" } = err;
    res.render("err.ejs", { message })
    // res.status(statusCode).send(message);
})


app.listen(8080, () => {
    console.log("Server is running...........");
})