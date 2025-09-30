const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./modals/listing');
const path = require('path');
const methodOverride = require('method-override');

app.set("view engine", "ejs");
app.set ("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));



main().then(()=> {
    console.log("Database Connect..........");    
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

// ------------------------------------------------------> home route
app.get("/", async (req, res) => {
    const alllist = await Listing.find()
    res.render("home.ejs", {alllist});        
})

// ----------------------------------------------------------> Add route

app.get("/add", (req, res) => {
    res.render("add.ejs")
})

app.post("/", async (req, res) => {
    let list = await new Listing(req.body.listing)
    await list.save();
    res.redirect("/")  
})

// --------------------------------------------------------> edit route
app.get("/:id/edit", async (req, res) => {
    let {id } =req.params;
    const list  = await Listing.findById(id);
    res.render("edit.ejs" ,{list})
})

app.put("/:id", async (req, res) => {
    let {id} = req.params;
    console.log(req.body);    
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    res.redirect("/")
})

// ---------------------------------------------------> View Route

app.get("/:id/view", async (req, res) => {
    let {id}  = req.params
    let list = await Listing.findById(id);
    res.render("view.ejs", {list})
})

// -----------------------------------------------------> Delete Route

app.delete("/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/")  
})


app.listen(8080, () => {
    console.log("Server is running...........");    
})