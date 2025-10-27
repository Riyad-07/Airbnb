const express = require("express");
const router = express.Router()
const wrapAsync = require("../util/wrapAsync");
const { listingSchema } = require("../joiSchema");
const ExpressError = require("../util/ExpressError");
const Listing = require("../modals/listing");




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
router.get("/", wrapAsync(async (req, res) => {
    const alllist = await Listing.find()
    res.render("home.ejs", { alllist });
}))

// ----------------------------------------------------------> Add route

router.get("/add", (req, res) => {
    res.render("add.ejs")
})

router.post("/add", validatedListing, wrapAsync(async (req, res) => { 
    let list = await new Listing(req.body.listing) 
    await list.save();
    req.flash("success", "Add Successfully");
    res.redirect("/")

}))

// --------------------------------------------------------> edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error", "This list Not Found");
        return res.redirect("/")
    }
    res.render("edit.ejs", { list })
}))

router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success", "Update Successfully");
    res.redirect(`/${id}/view`);
}))

// ---------------------------------------------------> View Route

router.get("/:id/view", wrapAsync(async (req, res) => {
    let { id } = req.params
    let list = await Listing.findById(id).populate("reviews");
    if(!list){
        req.flash("error", "This list Not Found");
        return res.redirect("/")
    }
    res.render("view.ejs", { list })
}))

// -----------------------------------------------------> Delete Route

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Delete Successfully");
    res.redirect("/")
}))

module.exports = router;