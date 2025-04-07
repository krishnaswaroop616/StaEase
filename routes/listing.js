const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");



router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    const search=false;
    const mylisting=false;
    res.render("listings/index.ejs", { allListings,search,mylisting });

}));

router.get("/new",isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});



router.get("/search",async(req,res)=>{
    let {title}=req.query;  
    const mylisting=false;
    const search=true;
    const allListings=await Listing.find({title:{ $regex: new RegExp(title, "i") } });
    if(!allListings || allListings.length==0){
        req.flash("error","No such place");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{allListings,search,mylisting});
});

router.get("/myListings",isLoggedIn,async(req,res)=>{
    let id=res.locals.currUser._id;
    const search=false;
    const mylisting=true;
    const allListings=await Listing.find({owner:id});
    res.render("listings/index.ejs",{allListings,search,mylisting});
});



router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    else {
        res.render("listings/show.ejs", { listing });
    }

}));




router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
}));

router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));



router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");

}));


module.exports = router;