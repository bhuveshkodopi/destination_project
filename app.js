if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const ExpressError = require("./utils/expresserror.js");
const listings = require("./routes/listings");
const reviews = require("./routes/review");
const session = require("express-session");
const { default: MongoStore } = require("connect-mongo");
const passport = require('passport');
const flash = require("connect-flash");
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const UserRoutes = require('./routes/user');
const multer = require('multer');


async function connectDB() {
  try {
    const uri = process.env.ATLASDB_URL;
    if (!uri) throw new Error("ATLASDB_URL is missing in environment variables");

    await mongoose.connect(uri);

    console.log("✅ MongoDB Atlas connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
connectDB();

const store = new MongoStore({ 
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
 });

 store.on("error", function (e) {
  console.log("error = ",e);
});

const sessionConfig = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};

app.use(session({
  store,
  ...sessionConfig
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});

// app.get("/", (req, res) => {
//   res.send("hi i am root");
// });


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",UserRoutes);


app.use((req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
})

app.listen(3000, () => {
  console.log("Server started on port 3000");
});