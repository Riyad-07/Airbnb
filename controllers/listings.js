const Listing = require("../modals/listing");


// -------------------------------------------------------------> home / index

module.exports.homeListing = async (req, res) => {
    const alllist = await Listing.find()
    res.render("home.ejs", { alllist });
}


// -----------------------------------------------------------------> add 

module.exports.addListing = async (req, res) => { 
    let list = await new Listing(req.body.listing);
    list.owner = req.user._id;
    await list.save();
    req.flash("success", "Add Successfully");
    res.redirect("/")

}


// --------------------------------------------------------------------------> Edit
// -------------- edit form

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error", "This list Not Found");
        return res.redirect("/")
    }
    res.render("edit.ejs", { list })
}

// -------------------------------------------> update edit

module.exports.updateEditListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success", "Update Successfully");
    res.redirect(`/${id}/view`);
}

// ------------------------------------------------------------------------------> view

module.exports.viewListing = async (req, res) => {
    let { id } = req.params
    let list = await Listing.findById(id).populate( {path:"reviews", populate:{path: "author"} }).populate("owner");
    if(!list){
        req.flash("error", "This list Not Found");
        return res.redirect("/")
    }    
    res.render("view.ejs", { list })
}

// ---------------------------------------------------------------------------------------------- Delete

module.exports.deletListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Delete Successfully");
    res.redirect("/")
}