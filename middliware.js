const listeningModel = require("./models/listenings.js");
const joi = require("./schema.js");
const ExpressError = require("./utils/expresserror.js");
const reviewModel = require("./models/reviews");


module.exports = {
    isLoggedIn: (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.session.redirectUrl = req.originalUrl;
            req.flash("error", "You must be logged in to create a listing");
            return res.redirect("/login");
        }
        next();
    },
    saveRedirectUrl: (req, res, next) => {
        if (req.session.redirectUrl) {
            res.locals.redirectUrl = req.session.redirectUrl;
        }
        next();
    },

    isowner: async (req, res, next) => {
        let { id } = req.params;
        let listings = await listeningModel.findById(id);
        if (!listings.owner.equals(req.user._id)) {
            req.flash("error", "You don't have permission to update");
            return res.redirect(`/listings/${id}`);
        }
        next();

    },

    validate : (req,res,next)=>{
        let {error} = joi.listingSchema.validate(req.body);
        if(error) {
            throw new ExpressError(error.details[0].message, 400);
        }
        next();
    },

    validateReview : (req,res,next)=>{
      let {error} = joi.reviewSchema.validate(req.body);
      if(error) {
        throw new ExpressError(error.details[0].message, 400);
      }
      next();
    },
    
    isauthor : async (req,res,next)=>{
      let {id,reviewid} = req.params;
      let review = await reviewModel.findById(reviewid);
      if(!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to delete this review");
        return res.redirect(`/listings/${id}`);
      }
      next();
    },
}

