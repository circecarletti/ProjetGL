const jwt = require('jsonwebtoken');
const ManagerModel = require('../models/manager.model');

//middleware to check if user is connected and if is an adult member
//adultmember
module.exports.checkManager = (req, res, next) => {
    const token = req.cookies.jwt;
    //verify token cookie 
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                //delete cookie
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge:1 });
                next();
            } else {
                //if decoded token id is manager
                if(!(decodedToken.statut === 'manager')) {
                    //token is not manager delete locals temporary locals parameters
                    res.locals.user = null;
                    next();
                }
                console.log('decoded token ' + decodedToken)
                const user = await ManagerModel.findOne({id: decodedToken.id});
                res.locals.user = user;
                console.log(res.locals.user);
                next();
            }
        })
    } else {
        //no token existed
        res.locals.user = null;
        next();
    }
}


//require auth manager 
module.exports.requireAuthManager = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) { 
        //verify token cookie 
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err);
            } else if(!(decodedToken.statut === 'manager')) {
                console.log(err);
            } else {
                console.log(decodedToken.id);
                next();
            }
        });
    } else {
        console.log('No token');
    }
};
