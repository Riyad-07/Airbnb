const express = require("express");
const router = express.Router()
const wrapAsync = require("../util/wrapAsync");
const Listing = require("../modals/listing");
const {isLogedIn, isOwner, validatedListing} = require("../middleware");



// ------------------------------------------------------> home route
router.get("/", wrapAsync(async (req, res) => {
    const alllist = await Listing.find()
    res.render("home.ejs", { alllist });
}))

// ----------------------------------------------------------> Add route

router.get("/add", isLogedIn, (req, res) => {    
    res.render("add.ejs")
})

router.post("/add", validatedListing, wrapAsync(async (req, res) => { 
    let list = await new Listing(req.body.listing);
    list.owner = req.user._id;
    await list.save();
    req.flash("success", "Add Successfully");
    res.redirect("/")

}))

// --------------------------------------------------------> edit route
router.get("/:id/edit", isLogedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error", "This list Not Found");
        return res.redirect("/")
    }
    res.render("edit.ejs", { list })
}))

router.put("/:id", isLogedIn, isOwner, validatedListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success", "Update Successfully");
    res.redirect(`/${id}/view`);
}))

// ---------------------------------------------------> View Route

router.get("/:id/view", wrapAsync(async (req, res) => {
    let { id } = req.params
    let list = await Listing.findById(id).populate("reviews").populate("owner");
    if(!list){
        req.flash("error", "This list Not Found");
        return res.redirect("/")
    }    
    res.render("view.ejs", { list })
}))

// -----------------------------------------------------> Delete Route

router.delete("/:id", isLogedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Delete Successfully");
    res.redirect("/")
}))

module.exports = router;