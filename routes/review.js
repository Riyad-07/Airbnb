const express = require("express");
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../util/wrapAsync");
const { validateReview, isLogedIn, isReviewOwner } = require("../middleware");


const reviewController = require("../controllers/reviews")

// -----------------------------------------------------> Reviews
// post route
router.post("/", isLogedIn, validateReview , wrapAsync( reviewController.addReview));
// -------------review Delete Route

router.delete("/:reviewId", isLogedIn, isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;