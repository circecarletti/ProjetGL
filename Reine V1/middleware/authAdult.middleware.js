const jwt = require('jsonwebtoken');
const AdultMemberModel = require('../models/adultmember.model');

//middleware to check if user is connected and if is an adult member
//adultmember
module.exports.checkAdultMember = async (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) { 
        //verify token cookie 
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                //delete cookie 
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge:1 });
                res.json({success:false, message: 'error verify token'});
            } else {
                //if decoded token id is adult member
                if(!(await AdultMemberModel.exists({ id: decodedToken.id}))) {
                    //token is not adult member delete locals temporary locals parameters
                    res.locals.user = null;
                    res.json({success:false, message: 'error statut'});
                }
                console.log('decoded token ' + decodedToken)
                const user = await AdultMemberModel.findOne({id: decodedToken.id});
                res.locals.user = user;
                console.log(res.locals.user);
                res.json({ success: true, message: "success verify adultmember"}); 
                next();
            }
        })
    } else {
        //no token existed
        res.locals.user = null;
        res.json({success:false, message: 'no token'});
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
                res.json({success:false, message: 'error verify token'});
            }else if(!(await AdultMemberModel.exists({ id: decodedToken.id}))) {
                console.log(err);
                res.json({success:false, message: 'error statut'});
            } else {
                console.log(decodedToken.id);
                res.json({success:true, message: 'authentification adult member ok'});
                next();
            }
        });
    } else {
        console.log('No token');
        res.json({success:false, message: 'no token'});
    }
};
