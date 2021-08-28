const { User } = require('../models/User');



let auth = (req, res, next) => {
    //1. bring token from client page using cooike-parser
    let token = req.cookies.x_auth;

    //2. decode token then find user
    User.findByToken(token, (err,user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true})    //if user doesn't exist, let client know


        //if user exist, give info 
        req.token = token;
        req.user = user;
        next(); //next process after this middle ware
         
    })
    //3. user exist, autho OK

}

module.exports = {auth};