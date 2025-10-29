const Listing = require("../modals/listing");
const Review = require("../modals/review");

module.exports.addReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("Review Saved.....");
    req.flash("success", "Add Successfully");
    res.redirect(`/${listing.id}/view`)
}


module.exports.deleteReview = async(req, res) => {
    let {id, reviewId} = req.params;
    Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Delete Successfully");
    res.redirect(`/${id}/view`)
}
