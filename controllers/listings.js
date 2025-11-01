const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

// module.exports.index = async (req,res)=>{
//     const allListing = await Listing.find({})
//     res.render("listing/index.ejs",{allListing});
// };

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let allListing;

  if (category) {
    allListing = await Listing.find({ category });
  } else {
    allListing = await Listing.find({});
  }

  res.render("listing/index.ejs", { allListing, category });
};


module.exports.renderNewForm = (req,res)=>{
    res.render("listing/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path :"reviews",
        populate :{
            path : "author",
        },
    })
    .populate("owner");

    if(!listing){
        req.flash("error","Requested Listing Does Not Exist!!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listing/show.ejs",{listing});
};

module.exports.createListing = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
        })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    
    req.flash("success","New Listing Created!!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Requested Listing Does Not Exist!!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/,w_250");
    res.render("listing/edit.ejs",{listing , originalImageUrl});
    
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }

    req.flash("success","Listing updated successfully!!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.searchListings = async (req, res) => {
  const query = req.query.q;

  // agar empty query
  if (!query || query.trim() === "") {
    req.flash("error", "Please enter a search term!");
    return res.redirect("/listings");
  }

  const regex = new RegExp(query, "i");

  const allListing = await Listing.find({
    $or: [
      { title: regex },
      { location: regex },
      { country: regex },
    ],
  });

  res.render("listing/index", { allListing, category: null });
};





