const User = require("../modals/user");


module.exports.newSignup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let regUser = await User.register(newUser, password);
        req.login(regUser, (err)=>{
            if(err){
                return next(err)
            }            
            req.flash("success", "Succesfully Register");
            res.redirect("/")
        })
        
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }

}

// -------------------------------------------------------------------------> log in

module.exports.logIn = async (req, res) => {
    req.flash("success", "Login Successfull");
    let finalUrl = res.locals.newUrl || "/";
    res.redirect(finalUrl);
}

// ------------------------------------------------------------------ log out
module.exports.logOut =  (req, res, next) => {
    req.logOut((err)=> {
        if(err){
            return next(err);
        }
        req.flash("success", "Log Out Successfull");
        res.redirect("/")
    })
}