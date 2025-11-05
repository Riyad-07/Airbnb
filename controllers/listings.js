const Listing = require("../modals/listing");


// -------------------------------------------------------------> home / index

module.exports.homeListing = async (req, res) => {
    const alllist = await Listing.find()
    res.render("Home.ejs", { alllist });
}


// -----------------------------------------------------------------> add 

module.exports.addListing = async (req, res) => { 
    let url = req.file.path;
    let filename = req.file.filename;
    let list = await new Listing(req.body.listing);
    list.owner = req.user._id;
    list.image = {url, filename}
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
    let originalImage =  list.image.url;
    originalImage = originalImage.replace("/upload", "/upload/e_blur:500")
    res.render("edit.ejs", { list, originalImage })
}

// -------------------------------------------> update edit

module.exports.updateEditListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename}
        await listing.save();
    }
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