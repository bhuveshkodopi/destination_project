const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listeningModel = require("../models/listenings.js");
const { isLoggedIn,isowner,validate,isauthor } = require("../middliware.js");
const { index, new: newListing, show, create, update, delete: deleteListing, edit: editListing } = require("../controller/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn, upload.single('listing[image]'), validate, wrapAsync(create))


router.get("/new",isLoggedIn, wrapAsync(newListing));

router.route("/:id")
.get(wrapAsync(show))
.put(isLoggedIn,isowner,upload.single('listing[image]'),validate, wrapAsync(update))
.delete(isLoggedIn,isowner, wrapAsync(deleteListing));

router.get("/:id/edit",isLoggedIn, wrapAsync(editListing));


module.exports = router;