const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");

const { validateReview ,isLoggedIn} = require("../middliware.js");

const reviewController = require("../controller/reviews.js");

 
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.create));

router.delete("/:reviewId",isLoggedIn, wrapAsync(reviewController.delete));

module.exports = router;