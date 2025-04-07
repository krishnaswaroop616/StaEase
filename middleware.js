const Listing=require("./models/listing"); 
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Reviews = require("./models/review.js");

module.exports.isLoggedIn = ((req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Login to proceed");
        res.redirect("/login");
        return;
    }
    next();
});

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
}


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
};


module.exports.isOwner = (async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Not authorized to edit the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

module.exports.isAuthor=(async (req,res,next)=>{
    const {id,reviewId}=req.params;
    let review=await Reviews.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "Not authorized to delete the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

