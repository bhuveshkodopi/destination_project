
const reviewModel = require("../models/reviews");
const listeningModel = require("../models/listenings");

module.exports = {
    create: async (req, res) => {

        let listing = await listeningModel.findById(req.params.id);


        let newReview = new reviewModel({
            rating: req.body.rating,
            comment: req.body.comment
        });
        newReview.author = req.user._id;
        listing.reviews.push(newReview._id);

        await newReview.save();
        await listing.save();
        req.flash("success", "Review added!");
        res.redirect(`/listings/${req.params.id}`);


    },

    delete: async (req, res) => {
        let { id, reviewId } = req.params;
        
        const review = await reviewModel.findById(reviewId);
        
        
        if (!req.user || !req.user._id.equals(review.author)) {
            req.flash("error", "You don't have permission to delete this review");
            return res.redirect(`/listings/${id}`);
        }
        
        await listeningModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await reviewModel.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted!");
        res.redirect(`/listings/${id}`);
    }


}