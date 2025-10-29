const express = require("express");
const router = express.Router()
const wrapAsync = require("../util/wrapAsync");
const {isLogedIn, isOwner, validatedListing} = require("../middleware");

const allListingController = require("../controllers/listings");

// ---------------------------------------------------------------> home route
router.get("/", wrapAsync(allListingController.homeListing))

// ----------------------------------------------------------------------> Add route

router.get("/add", isLogedIn, (req, res) => {    
    res.render("add.ejs")
})

router.post("/add", validatedListing, wrapAsync(allListingController.addListing))

// --------------------------------------------------------------------------------------------------> edit route
router.get("/:id/edit", isLogedIn, isOwner, wrapAsync(allListingController.editListing))

router.put("/:id", isLogedIn, isOwner, validatedListing, wrapAsync(allListingController.updateEditListing))

// ------------------------------------------------------------------------------------------------------------------> View Route

router.get("/:id/view", wrapAsync(allListingController.viewListing))

// -----------------------------------------------------------------------------------------------------> Delete Route

router.delete("/:id", isLogedIn, isOwner, wrapAsync(allListingController.deletListing))

module.exports = router;