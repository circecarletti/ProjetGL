const jwt = require('jsonwebtoken');
const AdultMemberModel = require('../models/adultmember.model');

//middleware to check if user is connected and if is an adult member
//adultmember
module.exports.checkAdultMember = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) { 
        //verify token cookie 
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                //delete cookie 
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge:1 });
                next();
            } else {
                //if decoded token id is adult member
                if(!(decodedToken.statut === 'adultmember')) {
                    //token is not adult member delete locals temporary locals parameters
                    res.locals.user = null;
                    next();
                }
                console.log('decoded token ' + decodedToken)
                const user = await AdultMemberModel.findOne({id: decodedToken.id});
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


//require auth adult member
module.exports.requireAuthAdult = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) { 
        //verify token cookie 
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err);
            }else if(!(decodedToken.statut === 'adultmember')) {
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
