const User = require("../models/user");
module.exports = {
    signup: (req, res) => {
        res.render("users/signup.ejs");
    },
    signupPost: async (req, res) => {
        try {
            let { username, email, password } = req.body;
            if (!username || !email || !password) {
                console.log("Missing fields");
                return res.redirect("/signup");
            }
            const newUser = new User({ username, email });
            let registeruser = await User.register(newUser, password);
            req.login(registeruser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Welcome to Wanderlust!");
                res.redirect("/listings");
            });
        } catch (error) {
            console.error("Signup error:", error);
            res.redirect("/signup");
        }
    },
    login: (req, res) => {
        res.render("users/login.ejs");
    },
    loginPost: async (req, res) => {
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    },
    logout: (req, res) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "You have been logged out!");
            res.redirect("/listings");
        });
    }
}