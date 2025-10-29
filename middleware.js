const { listingSchema, reviewSchema } = require("./joiSchema");
const Listing = require("./modals/listing");
const Review = require("./modals/review");
const ExpressError = require("./util/ExpressError");

module.exports.isLogedIn = (req,res, next) => {
    console.log();    
    if(!req.isAuthenticated()){
        req.session.newUrl = req.originalUrl;
        req.flash("error", "Must be Login")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveUrl = (req, res, next) => {   
    if(req.session.newUrl){
        res.locals.newUrl = req.session.newUrl;
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let {id}= req.params;
    let list = await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.curUser._id)){
        req.flash("error", "Only owner Permission");
        return res.redirect(`/${id}/view`)
    }
    next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    let {id, reviewId}= req.params;
    let review = await Review.findById(reviewId);
    console.log(review);    
    if(!review.author.equals(res.locals.curUser._id)){
        console.log(res.locals.curUser._id);
        
        req.flash("error", "Only owner Permission");
        return res.redirect(`/${id}/view`)
    }
    next();
}

module.exports.validatedListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    }else{
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    }else{
        next();
    }
}
