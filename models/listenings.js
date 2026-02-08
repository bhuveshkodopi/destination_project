const mongoose = require("mongoose");
const schema = mongoose.Schema;
const reviewModel = require("./reviews");

const listeningSchema = new schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        
    },
    image : {
        filename : {
            type : String,
            default : "listingimage"
        },
        url : {
            type : String,
            default : "https://unsplash.com/photos/city-skyline-at-night-with-illuminated-skyscrapers-P5tJqjJhQ1g",
            set : (v) => v === "" ? "https://unsplash.com/photos/city-skyline-at-night-with-illuminated-skyscrapers-P5tJqjJhQ1g" : v,
        }
    },
    price : Number,
    location : String,
    country : String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
});

// Post middleware to delete associated reviews when a listing is deleted
listeningSchema.post("findOneAndDelete", async function(listing) {
    if (listing && listing.reviews.length > 0) {
        await reviewModel.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const listeningModel = mongoose.model("listenings",listeningSchema);
module.exports = listeningModel;
