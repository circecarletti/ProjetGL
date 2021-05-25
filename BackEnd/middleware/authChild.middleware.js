const jwt = require('jsonwebtoken');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');
const AdultMemberModel = require('../models/adultmember.model');

//middleware to check if user is connected and if is an child member and logout if not 
//require auth child member
module.exports.requireAuthChild = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) { 
        //verify token cookie 
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err);
                //delete cookie
                res.cookie('jwt', '', { maxAge:1 });
                res.json({success:false, message: 'error verify token'});
            } else if(!(ChildMemberModel.exists({ id: decodedToken.id}))) {
                    console.log(err);
                    res.json({success:false, message: 'error statut'});
            } else {
                console.log(decodedToken.id);
                res.json({success:true, message: 'authentification child member ok'});
                next();
            }
        });
    } else {
        console.log('No token');
        res.json({success:false, message: 'no token'});
    }
};
