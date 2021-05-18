
const AdultMemberModel = require('../models/adultMember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');
const LoanModel = require('../models/loan.model');

//signup member
//fonction inscription 
module.exports.signUp = async (req, res) => {
    const {_id, password, name, firstName, age, balance} = req.body

    try {
        //creating member 
        const member = await MemberModel.create({_id, password, name, firstName, balance});

        //creating adulmember,  member included in adultmember
        const user = await AdultMemberModel.create({ _id, age, member}); 

        console.log('Member successfully created!'); 
        return res.status(201).json({ success: true, user: user._id }); 
    }
    catch(err) {
        if(err.code == 11000)
            return res.status(409).json({ success: false, message: 'ID existed' });
       else 
            return res.status(400).send({ success: false, err });
    }
}

//signup childmember
//fonction creerCompteMineur
module.exports.signUpChild = async (req, res) => {
    const {_id, password, name, firstName, age, adultMember} = req.body

    try {
        //check existence of adultmember
        const userExists = await AdultMemberModel.exists({ _id : adultMember }); 

        if(userExists){
            //creating member
            const member = await MemberModel.create({_id, password, name, firstName });
            //creating child member
            const user = await ChildMemberModel.create({ member, _id, age, adultMember });
            //update adult member add childmember
            AdultMemberModel.findOneAndUpdate({"_id":adultMember},{
                "$push": {"childList" : user}
            },{new: true, safe: true, upsert: true }, function(error){
                if(error)
                    return res.status(500).send({ success: false, message: "Database Error"});
            });
            console.log('ChildMember successfully created!'); 
            return res.status(201).json({success: true, user: user._id});
        } else 
            return res.status(404).send({success: false, message: 'Adultmember not found'});
    }
    catch(err) {
        if(err.code == 11000)
            return res.status(409).json({success: false, message: 'ID existed'});
        else 
            return res.status(400).send({success: false, err });
    }
}

//signup manager
module.exports.signUpManager = async (req, res) => {
    //console.log(req.body);
    const {_id, password, name, firstName} = req.body

    try {
        //creating manager user
        const user = await ManagerModel.create({ _id, password, name, firstName });
        console.log('Manager successfully created!'); 
        res.status(201).json({success: true, user: user._id}); 
    }
    catch(err) {
        if(err.code == 11000)
            return res.status(409).json({ success: false, message: 'ID existed' });
       else 
            return res.status(400).send({ success: false, err });
    }
}
