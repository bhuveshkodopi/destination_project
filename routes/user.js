const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middliware.js");
const userController = require("../controller/user.js");

router.route("/signup")
.get(userController.signup)
.post(wrapAsync(userController.signupPost));

router.route("/login")
.get(userController.login)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}), wrapAsync(userController.loginPost));


router.get("/logout",userController.logout);

module.exports = router;