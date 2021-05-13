
const AdultMemberModel = require('../models/adultMember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');


//signup member
//fonction inscription 
module.exports.signUp = async (req, res) => {
    console.log(req.body);
    const {email, password, name, firstName, age, balance} = req.body

    try {
        //creating member 
        await MemberModel.create({email, password, name, firstName, balance });

        //creating adulmember,  member included in adultmember
        const user = await AdultMemberModel.create({ email, age }); 

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

//signup childmember
//fonction creerCompteMineur
module.exports.signUpChild = async (req, res) => {
    console.log(req.body);
    const {email, password, name, firstName, age, adultMember} = req.body

    try {
        //check existence of adultmember
        const userExists = await AdultMemberModel.exists({ email : adultMember }); 

        if(userExists){
            //creating member
            await MemberModel.create({email, password, name, firstName });
            //creating child member
            const user = await ChildMemberModel.create({ email, age, adultMember });
            //update adult member add childmember
            AdultMemberModel.findOneAndUpdate({"email":adultMember},{
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

//signup manager
module.exports.signUpManager = async (req, res) => {
    console.log(req.body);
    const {email, password, name, firstName} = req.body

    try {
        //creating manager user
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
