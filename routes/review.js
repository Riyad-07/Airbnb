const express = require("express");
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../util/wrapAsync");
const Listing = require("../modals/listing");
const Review = require('../modals/review');
const { validateReview, isLogedIn, isReviewOwner } = require("../middleware");




// -----------------------------------------------------> Reviews
// post route
router.post("/", isLogedIn, validateReview , wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("Review Saved.....");
    req.flash("success", "Add Successfully");
    res.redirect(`/${listing.id}/view`)
}))
// -------------review Delete Route

router.delete("/:reviewId", isLogedIn, isReviewOwner, wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Delete Successfully");
    res.redirect(`/${id}/view`)
}))

module.exports = router;