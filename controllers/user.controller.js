const AdultMemberModel = require('../models/adultMember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');
const { isEmail } = require('validator');


//informations user 
module.exports.userInfo = (req, res) => {
    console.log(req.params);
    if(!((req.params.email).isEmail() && ((MemberModel.find({'email': req.params.email}).count() > 0) || (ManagerModel.find({'email': req.params.email}).count() > 0))))
        return res.status(400).send('email unknown : ' + req.params.email)
    
    if(AdultMemberModel.find({'email': req.params.email}).count() > 0 ){
        console.log(AdultMemberModel.aggregate([
            { 
                $match: { email : req.params.email } },
                { 
                $lookup: { 
                    from: 'members',
                    localField: 'email',
                    foreignField: 'email', 
                    as: 'adult_member' } 
                }
            ]).pretty()/*.select('-password')*/ /*.where(email)*/).exec((err, result) => {
                if (err) throw err;
                console.log(result);
            })
        
        

        //AdultMemberModel.findById()
    }/*
    else if(ChildMemberModel.find({'email': req.params.email}).count() > 0 ){

    }
    else { //email manager
        MemberModel.findById(req.params.email, (err, docs) => {
            if(!err) res.send(docs);
            else console.log(err);
        }).select('-password');

    };

*/


};