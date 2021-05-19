const AdultMemberModel = require('../models/adultMember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');
const ResourceModel = require('../models/resource.model');
const LoanModel = require('../models/loan.model');
const bcrypt = require('bcrypt');

//informations user 
module.exports.userInfo = async (req, res) => {

    const email = req.params.id;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email}) || await ManagerModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    //adult  
    if(await AdultMemberModel.exists({id: email})){
         await AdultMemberModel.findOne({ id : email}, 'childList id age -_id')
            .populate('member', "-dateSubscription -password -nbFailConnection -id -__v -_id")  
            .then(function(infomembers){
                console.log('mail ' + email);
                return res.status(200).json(infomembers);
            })
            .catch(function(err) {
                return res.status(400).json({success: true, message : ' error email', err});
            });
    }
    //child
    else if(await ChildMemberModel.exists({id: email})){
        await ChildMemberModel.findOne({ id : email}, '-__v -_id')
            .populate('member', "-dateSubscription -password -nbFailConnection -id -__v -_id")   
            .then(function(infomembers){
                return res.status(200).json(infomembers);
            })
            .catch(function(err) {
                return res.status(400).json({success: true, message : 'error email', err});
            });
    }
    else { // manager
        await ManagerModel.findOne({id : email }, '-password -__v -_id')
            .then(function(infomanagers){
                return res.status(200).json(infomanagers);
            })
            .catch(function(err) {
                return res.status(400).json({success : false, message : 'error email', err});
            });
    };
};

//update name
module.exports.updateName = async (req, res) => {
    const email = req.body.id;
    const name = req.body.name;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    try {
        MemberModel.findOneAndUpdate(
                {id: email}, 
                {
                    $set: {
                        name: name
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true},
                (err,docs) => {
                    if(err) {
                        return res.status(500).send({success: false, message: "Name not modified",  err});
                    }
                }
            );
        return res.status(201).json({ success: true, message: "name modified"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "name not modified", err});
   }
};

//update firstName
module.exports.updateFirstName = async (req, res) => {
    const email = req.body.id;
    const firstName = req.body.firstName;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    try {
        MemberModel.findOneAndUpdate(
                {id: email}, 
                {
                    $set: {
                        firstName: firstName
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true},
                (err,docs) => {
                    if(err) return res.status(500).send({success: false, message: "firstName not modified",  err});
                }
            );
        return res.status(201).json({ success: true, message: "firstName modified"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "firstName not modified", err});
   }
};

//update firstName
module.exports.updateAge = async (req, res) => {
    const email = req.body.id;
    const age = req.body.age;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    try {
        //adult member
        if(await AdultMemberModel.exists({id: email})){
            AdultMemberModel.findOneAndUpdate(
                {id: email}, 
                {
                    $set: {
                        age: age
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true},
                (err,docs) => {
                    if(err) return res.status(500).send({success: false, message: "age not modified",  err});
                }
            );
            return res.status(201).json({ success: true, message: "age modified"}); 
        }else {
            //child member
            ChildMemberModel.findOneAndUpdate(
                {id: email}, 
                {
                    $set: {
                        age: age
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true},
                (err,docs) => {
                    if(err) return res.status(500).send({success: false, message: "age not modified",  err});
                }
            );
            return res.status(201).json({ success: true, message: "age modified"}); 
        }
    } catch (err) {
        return res.status(500).json({success: false, message: "age not modified", err});
   }
};


//update password
module.exports.updatePassword = async (req, res) => {
    const email = req.body.id;
    const password = req.body.password;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    try {
        MemberModel.findOneAndUpdate(
                {id: email}, 
                {
                    $set: {
                        password: password
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true},
                (err,docs) => {
                    if(err) {
                        console.log(err);
                        res.send.json({success: false, message: "password not modified",  err});
                        return;
                    }
                }
            )
        return res.status(201).json({ success: true, message: "password modified"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "password not modified", err});
   }
};

//fund account // approvisionner son compte 
module.exports.fundAccount = async (req, res) => {
    const email = req.body.id;
    const balance = req.body.balance;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    try {
        MemberModel.updateOne(
                {id: email}, 
                {
                    $inc: {
                        balance: balance
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true},
                (err,docs) => {
                    if(err) return res.status(500).send({success: false, message: "account not fund",  err});
                }
            );
            return res.status(201).json({ success: true, message: "account fund"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "account not fund", err});
   }
};

//fund account // approvisionner son compte 
module.exports.fundChildAccount = async (req, res) => {
    const email = req.body.id;
    const idChild = req.body.idChild;
    const balance = req.body.balance;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: idChild})))
        return res.status(400).json({success:'false', message: 'child account does not exist'});

    try {
        MemberModel.updateOne(
                {id: idChild}, 
                {
                    $inc: {
                        balance: balance
                    }
                },
                (err,docs) => {
                    if(err) return res.status(500).send({success: false, message: "child account not fund",  err});
                }
            )
        return res.status(201).json({ success: true, message: "child account fund"});
    } catch (err) {
        return res.status(500).json({success: false, message: "child account not fund", err});
    }
};


//buy membershio // acheter un abonnement
module.exports.buyMembership = async (req, res) => {
    const email = req.body.id;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    try {
        const balance = await MemberModel.findOne({id: email}).select('balance -_id');
        console.log(balance);
        if(balance.balance >= 100 ){
            MemberModel.updateOne(
                {id: email}, 
                {
                    $inc: {
                        balance: Number(-100)
                    },
                    $set: {
                        dateSubscription: new Date, 
                        subscribe: true
                    }
                },
                { new: true, upsert: true},
                (err,docs) => {
                    if(err) return res.status(500).send({succes: false, message: "membership not purchased",  err});
                }
            );
            return res.status(201).json({ success: true, message: "membership purchased"});
        }else {
            return res.status(400).send({success: false, message: "insufficient balance"});
        }
    } catch (err) {
        return res.status(500).json({success: false, message: "membership not purchased", err});
    }
};


//unlock a member  /debloquer un adherent
module.exports.unlockMember = async (req, res) => {
    const email = req.body.id;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    try {
        const lock = await MemberModel.findOne({id: email}).select('block -_id');
        console.log(lock);
        if(!lock.lock) 
            return res.status(400).json({status: false, message: 'member not lock'});
        
        MemberModel.updateOne(
                {id: email}, 
                {
                    $set: {
                        block: false
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true},
                (err) => {
                    if(err) {
                        console.log(err);
                        res.send.json({success: false, message: "member not unlocked",  err});
                        return;
                    }
                }
            )
        return res.status(201).json({ success: true, message: "member unlock"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "member not unlocked", err});
   }
};

//deleteUser
module.exports.deleteUser = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    try {
        //verify if member is lock
        const lock = await MemberModel.findOne({id: email}).select('block -_id');
        console.log(lock);
        if(lock.lock) 
            return res.status(400).json({status: false, message: 'member not delete member is lock'});

        const id = await MemberModel.findOne({id: email}).select('_id');
        await LoanModel.remove({idAdherent: id._id}).exec();  //remove loan associate to member
        await MemberModel.remove({id: email}).exec();  //remove member

        if(await AdultMemberModel.exists({id: email})){
            await AdultMemberModel.remove({id: email}).exec();  //remove adult member
        }else {
            await ChildMemberModel.remove({id: email}).exec();  //remove child  member
        }
        return res.status(200).json({ success: true, message: "member deleted"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "error deleting member", err});
   }
};

//createRessource
module.exports.createRessource = async (req, res) => {
    const newRessource = new ResourceModel({
        title: req.body.title,
        category: req.body.category,
        author: req.body.author, 
        releaseDate: req.body.releaseDate
    });

    try {
        const ressource = await newRessource.save();
        console.log(ressource)
        return res.status(201).json({success: true, messaege:'ressource created', id: ressource.id}); 
    }
    catch(err) {
        return res.status(400).send({ success: false, message: 'error creating ressource', err });
    }
}


//renew membershio // renouveller un abonnement
module.exports.renewMembership = async (req, res) => {
    const email = req.body.id;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.status(400).send('email not in database : ' + email);
    
    try {
        const balance = await MemberModel.findOne({id: email}).select('balance -_id');
        console.log(balance);
        if(balance.balance >= 100 ){
            MemberModel.updateOne(
                {id: email}, 
                {
                    $inc: {
                        balance: Number(-100)
                    },
                    $set: {
                        dateSubscription: new Date, 
                        subscribe: true
                    }
                },
                { new: true, upsert: true},
                (err,docs) => {
                    if(err) return res.status(500).send({success: false, message: "membership not purchased",  err});
                }
            );
            return res.status(201).json({ success: true, message: "membership purchased"});
        }else {
            return res.status(400).send({success: false, message: "insufficient balance"});
        }
    } catch (err) {
        return res.status(500).json({success: false, message: "membership not purchased", err});
    }
};




//rent a ressource //louer une ressource
module.exports.rentRessource = async (req, res) => {
    const email = req.body.id;
    const idRessource = req.body.idRessource;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.status(400).send('email not in database : ' + email);
    
    try {
        Order.findOne({'_id' : id})
        .select('client.phone client.email orderdetails.status reference')
        .exec(function(err, order) {
          //
        });
    
        
        if(MemberModel)

        await MemberModel.findOneAndUpdate(
                {id: email}, 
                {
                    $set: {
                        password: password
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true},
                (err,docs) => {
                    if(err) {
                        console.log(err);
                        res.send.json({success: false, message: "password not modified",  err});
                        return;
                    }
                }
            )
        return res.status(201).json({ success: true, message: "password modified"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "password not modified", err});
   }
};