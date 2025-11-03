const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.get("/search", wrapAsync(listingController.searchListings));

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
    isLoggedIn,
    // validateListing,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync( listingController.createListing),
    );

// new route
router.get("/new", isLoggedIn , listingController.renderNewForm);

// show route2
router
    .route("/:id")
    .get(wrapAsync( listingController.showListing ))
    .put(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        async (req, res) => {
            try {
            await listingController.createListing(req, res);
            } catch (err) {
            console.log("❌ Error while creating listing:", err);
            req.flash("error", "Something went wrong!");
            res.redirect("/listings");
            }
        }
        )

    // .put(
    // isLoggedIn,
    // isOwner,
    // upload.single('listing[image]'),
    // validateListing,
    // wrapAsync( listingController.updateListing))
    .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);

router.get("/:id/edit" ,
    isLoggedIn,
    isOwner,
    wrapAsync( listingController.renderEditForm)
);




module.exports = router;