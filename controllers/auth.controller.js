
const AdultMemberModel = require('../models/adultMember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');

module.exports.signUp = async (req, res) => {
    console.log(req.body);
    const {email, password, name, firstName, age} = req.body

    try {
        const member = await MemberModel.create({email, password, name, firstName });
        const user = await AdultMemberModel.create({ member, age }); 
        console.log('Member successfully created!'); 
        return res.status(201).send({ sucess: true, user: user._id }); 
    }
    catch(err) {
        if(err.code == 11000)
            return res.status(409).send({ sucess: false, message: 'ID existed' });
       else 
            return res.status(400).send({ sucess: false, err });
    }
}

module.exports.signUpChild = async (req, res) => {
    console.log(req.body);
    const {email, password, name, firstName, age, adultMember} = req.body

    try {
        const idMember = await MemberModel.find({ email: adultMember}).select("_id");
        if ((idMember.length == 0))
            return res.status(404).send({sucess: false, message: 'member not found'});
        const id = idMember[0]._id;
        const userExists = await AdultMemberModel.exists({ member : id }); 

        if(userExists){
            const idAdultM = await AdultMemberModel.find({ member: id}).select("_id");
            const idAdultMember = idAdultM[0]._id;
            const member = await MemberModel.create({email, password, name, firstName });
            const user = await ChildMemberModel.create({ member, age, adultMember });
            AdultMemberModel.findOneAndUpdate({"_id":idAdultMember},{
                "$push": {"childList" : email}
            },{new: true, safe: true, upsert: true }, function(error){
                if(error)
                    return res.status(500).send({ success: false, message: "Database Error"});
            });
            console.log('ChildMember successfully created!'); 
            return res.status(201).send({sucess: true, user: user._id});
        } else 
            return res.status(404).send({sucess: false, message: 'Adultmember not found'});
    }
    catch(err) {
        if(err.code == 11000)
            return res.status(409).send({sucess: false, message: 'ID existed'});
        else 
            return res.status(400).send({sucess: false, err });
    }
}

module.exports.signUpManager = async (req, res) => {
    console.log(req.body);
    const {email, password, name, firstName} = req.body

    try {
        const user = await ManagerModel.create({ email, password, name, firstName });
        console.log('Manager successfully created!'); 
        res.status(201).send({sucess: true, user: user._id}); 
    }
    catch(err) {
        if(err.code == 11000)
            return res.status(409).send({ sucess: false, message: 'ID existed' });
       else 
            return res.status(400).send({ sucess: false, err });
    }
}
