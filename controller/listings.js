const listeningModel = require("../models/listenings.js");

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let data;
  
  if (category) {
    // Filter by category - for now, we'll show all listings since category field isn't in schema yet
    // You can add category field to your listing model later
    data = await listeningModel.find({});
  } else {
    data = await listeningModel.find({});
  }
  
  res.render("listings/index.ejs", { data: data, currentCategory: category });
}

module.exports.new = async (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.show = async (req, res) => {
  let { id } = req.params;
  let data = await listeningModel.findById(id).populate("reviews").populate("owner").populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  });
  res.render("listings/show.ejs", { data: data });
}

module.exports.create = async (req, res) => {
  let { title, description, price, location, country } = req.body.listing;
  const newListing = new listeningModel({ title, description, price, location, country });

  // Handle image upload from cloudinary
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
}

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let { title, description, price, location, country } = req.body.listing;
  
  const updateData = { title, description, price, location, country };
  
  // Handle image upload from cloudinary
  if (req.file) {
    updateData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
   
  await listeningModel.findByIdAndUpdate(id, updateData);
  res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await listeningModel.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
}

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const user = await listeningModel.findOne({ _id: id });
  res.render("listings/edit.ejs", { data: user });
}