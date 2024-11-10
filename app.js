const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

main()
.then(()=>{
    console.log("connected to db");
})
.catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded( { extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res)=>{
    res.send("hi, i am root");
});

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
};

//Index route
app.get("/listings", wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
   
}));

//New Route
app.get("/listings/new", wrapAsync(async (req, res)=>{
    res.render("listings/new.ejs");
}));

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
   
}));

//create Route
app.post("/listings",validateListing, wrapAsync(async (req, res)=>{
    // let { title, description, image, price, location } = req.body;
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
   res.redirect("/listings");
}));

//edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res)=>{
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing!");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// app.get("/testListing", async (req, res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page not found!"));
});

app.use((err,req,res,next)=>{
    let {status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("error.ejs", {message});
    //res.status(status).send(message);
});

app.listen(8081, ()=>{
    console.log("server listening...");
});