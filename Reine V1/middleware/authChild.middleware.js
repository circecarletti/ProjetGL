const jwt = require('jsonwebtoken');
const ChildMemberModel = require('../models/childmember.model');

//middleware to check if user is connected and if is an child member
//child
module.exports.checkChildMember = (req, res, next) => {
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
                //if decoded token id is child member
                if(!(decodedToken.statut === 'childmember')) {
                    //token is not child member delete locals temporary locals parameters
                    res.locals.user = null;
                    next();
                }
                console.log('decoded token ' + decodedToken)
                const user = await ChildMemberModel.findOne({id: decodedToken.id});
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


//require auth child member
module.exports.requireAuthChild = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) { 
        //verify token cookie 
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err);
            } else if(!(decodedToken.statut === 'childmember')) {
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
