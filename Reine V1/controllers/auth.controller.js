const AdultMemberModel = require('../models/adultMember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');
const LoanModel = require('../models/loan.model');


//signup member
//fonction inscription 
module.exports.signUp = async (req, res) => {
    const {id, password, name, firstName, age, balance} = req.body

    try {
        //verifiy id not in manager collection
        if (await ManagerModel.exists({ id: id}))
            return res.status(409).json({success: false, message: 'ID existed'}); 
        console.log('ok 1 ')
        //creating member 
        const member = await MemberModel.create({id:id, password: password, name: name, firstName: firstName, balance: balance});
        console.log('ok 3')
        //creating adultmember,  member included in adultmember
        const user = await AdultMemberModel.create({ id: id, age: age, member: member}); 

        const loan = await LoanModel.create({idAdherent: member._id});
        
        await MemberModel.findOneAndUpdate({id:id}, {loan: loan._id},{new:true, upsert: true}, function(err, docs){
            if (err){
                console.log(err);
            }else {
                console.log("updated user docs ", docs);
            }
        });

        console.log('Member successfully created!'); 
        return res.status(201).json({ success: true, user: user.id }); 
    }
    catch(err) {
        //if(err.code == 11000)
        //    return res.status(409).json({ success: false, message: 'ID existed' , err});
       //else 
            return res.status(400).send({ success: false, err });
    }
}

//signup childmember
//fonction creerCompteMineur
module.exports.signUpChild = async (req, res) => {
    const {id, password, name, firstName, age, adultMember} = req.body

    try {
        //verifiy id not in manager collection
        if (await ManagerModel.exists({ id: id}))
            return res.status(409).json({success: false, message: 'ID manager existed'}); 

        //check existence of adultmember
        const userExists = await AdultMemberModel.exists({ id : adultMember }); 

        if(userExists){
            //creating member
            const member = await MemberModel.create({id, password, name, firstName });

            //creating child member
            const user = await ChildMemberModel.create({id:id, age,adultMember:adultMember, member});

            const loan = await LoanModel.create({idAdherent: member._id});
        
            await MemberModel.findOneAndUpdate({id:id}, {loan: loan._id},{new:true, upsert: true}, function(err, docs){
                if (err){
                    console.log(err);
                }else {
                    console.log("updated user docs ", docs);
                }
            });

            AdultMemberModel.findOneAndUpdate(
                { id: adultMember }, 
                { $push: { childList: user._id } },
               function (error, success) {
                    if (error) {
                         console.log( error);
                         return;
                    } 
            });
            console.log('ChildMember successfully created!'); 
            return res.status(201).json({success: true, user: user.id});
        } else 
            return res.status(404).send({success: false, message: 'Adultmember not found'});
    }
    catch(err) {
        if(err.code == 11000){
            console.log(err)
            return res.status(409).json({success: false, message: 'ID existed', err});
        }
        else 
            return res.status(400).send({success: false, err });
    }
}

//signup manager
module.exports.signUpManager = async (req, res) => {
    //console.log(req.body);
    const {id, password, name, firstName} = req.body

    try {
        //verifiy id not in members collection
        if (await MemberModel.exists({ id: id}))
            return res.status(409).json({success: false, message: 'ID existed'}); 

        //creating manager user
        const user = await ManagerModel.create({ id, password, name, firstName });
        console.log('Manager successfully created!'); 
        return res.status(201).json({success: true, user: user.id}); 
    }
    catch(err) {
        if(err.code == 11000)
            return res.status(409).json({ success: false, message: 'ID existed' });
       else 
            return res.status(400).send({ success: false, err });
    }
}
