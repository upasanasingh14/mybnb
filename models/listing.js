const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    filename: String,
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1631771971172-3d638185a49c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" 
        ? "https://images.unsplash.com/photo-1631771971172-3d638185a49c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
    }
})

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: imageSchema,
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;