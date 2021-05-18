const AdultMemberModel = require('../models/adultMember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');

var validator = require('validator');

//informations user 
module.exports.userInfo = async (req, res) => {
    const email = req.params._id;
    //check if it is an email
    if (!validator.isEmail(email)) 
        return res.status(400).json({ message : 'not an email'});

    //check if email is in the database
    if(!(await MemberModel.exists({ _id: email}) || await ManagerModel.exists({ _id: email})))
        return res.status(400).send('email not in database : ' + email);
    
    //adult email 
    if(await AdultMemberModel.exists({_id: email})){
         await AdultMemberModel.findOne({ _id : email}, 'childList _id age')
            .populate('member', "-dateSubscription -password -nbFailConnection -_id -__v")  
            .then(function(infomembers){
                console.log('mail ' + email);
                res.json(infomembers);
            })
            .catch(function(err) {
                res.status(400).json({message : ' error email', err});
            });
    }
    else if(await ChildMemberModel.exists({_id: email})){
        await ChildMemberModel.findOne({ _id : email}, '-__v')
            .populate('member', "-dateSubscription -password -nbFailConnection -_id -__v")   
            .then(function(infomembers){
                res.json(infomembers);
            })
            .catch(function(err) {
                res.status(400).json({message : 'error email', err});
            });
    }
    else { //email manager
        await ManagerModel.findOne({_id : email }, '-password -__v')
            .then(function(infomanagers){
                res.json(infomanagers);
            })
            .catch(function(err) {
                res.status(400).json({message : 'error email', err});
            });
    };
};