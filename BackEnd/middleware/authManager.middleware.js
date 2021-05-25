const jwt = require('jsonwebtoken');
const ManagerModel = require('../models/manager.model');
const AdultMemberModel = require('../models/adultmember.model');
const ChildMemberModel = require('../models/childmember.model');

//middleware to check if user is connected and if is an manager logout if not 
//require auth manager 
module.exports.requireAuthManager = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) { 
        //verify token cookie 
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err);
                //delete cookie
                res.cookie('jwt', '', { maxAge:1 });                
                res.json({success:false, message: 'error verify token'});
            } else if(!( ManagerModel.exists({ id: decodedToken.id}))) {
                console.log(err);
                //delete cookie
                res.cookie('jwt', '', { maxAge:1 });
                res.json({success:false, message: 'error statut'});
            } else {
                console.log(decodedToken.id);
                res.json({success:true, message: 'success authentification manager'});
                next();
            }
        });
    } else {
        console.log('No token');
        res.json({success:false, message: 'no token'});
    }
};
