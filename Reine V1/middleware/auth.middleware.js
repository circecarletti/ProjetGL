const jwt = require('jsonwebtoken');
const ManagerModel = require('../models/manager.model');
const AdultMemberModel = require('../models/adultmember.model');
const ChildMemberModel = require('../models/childmember.model');


//require auth manager, adult member or childmember 
module.exports.checkAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) { 
        //verify token cookie 
        console.log(token)
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            console.log(decodedToken)
            if(err) {
                console.log(err);
                res.json({ success: false, message: "error verify token"});
            }else if(await AdultMemberModel.exists({ id: decodedToken.id})){
                res.json({ success: true, message: "success verify adult member", statut:'adultmember'}); 
                next();      
            }else if(await ChildMemberModel.exists({ id: decodedToken.id})){
                res.json({ success: true, message: "success verify child member", statut:'childmember'}); 
                next();      
            }
            else if(await ManagerModel.exists({ id: decodedToken.id})){
                res.json({ success: true, message: "success verify manager", statut:'manager'}); 
                next();      
            }
            else {
                res.cookie('jwt', '', { maxAge:1 });
                res.json({ success: false, message: "error verify user", statut:''}); 
            }
        });   
    } else {
        console.log('No token');
        res.json({ success: false, message: "no token"}); 
    }
};
