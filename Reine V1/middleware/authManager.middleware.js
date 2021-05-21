const jwt = require('jsonwebtoken');
const ManagerModel = require('../models/manager.model');
const AdultMemberModel = require('../models/adultmember.model');
const ChildMemberModel = require('../models/childmember.model');

//middleware to check if user is connected and if is an adult member
//adultmember
module.exports.checkManager = async (req, res, next) => {
    const token = req.cookies.jwt;
    //verify token cookie 
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                //delete cookie
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge:1 });
                res.json({success:false, message: 'error verify token'});
            } else {
                //if decoded token id is manager
                if(!(await ManagerModel.exists({ id: decodedToken.id}))) {
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
module.exports.requireAuthManager = async (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) { 
        //verify token cookie 
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err);
                //delete cookie
                res.cookie('jwt', '', { maxAge:1 });                
                res.json({success:false, message: 'error verify token'});
            } else if(!(await ManagerModel.exists({ id: decodedToken.id}))) {
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
