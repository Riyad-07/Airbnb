module.exports.isLogedIn = (req,res, next) => {
    console.log();    
    if(!req.isAuthenticated()){
        req.session.newUrl = req.originalUrl;
        req.flash("error", "Must be Login")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveUrl = (req, res, next) => {   
    if(req.session.newUrl){
        res.locals.newUrl = req.session.newUrl;
    }
    next()
}