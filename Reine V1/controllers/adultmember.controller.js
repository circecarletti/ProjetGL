const AdultMemberModel = require('../models/adultmember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');


//informations user 
module.exports.userInfo = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    //adult  
    await AdultMemberModel.findOne({ id : email}, 'childList id age -_id')
        .populate('member', "-dateSubscription -password -nbFailConnection -id -__v -_id")  
        .then(function(infomembers){
            console.log('mail ' + email);
            return res.status(200).json(infomembers);
        })
        .catch(function(err) {
            return res.status(400).json({success: true, message : ' error email', err});
        });
};


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
            const member = await MemberModel.create({id, password, name, firstName, statut:'childmember'});

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
            return res.status(404).json({success: false, message: 'Adultmember not found'});
    }
    catch(err) {
        if(err.code == 11000){
            console.log(err)
            return res.status(409).json({success: false, message: 'ID existed', err});
        }
        else 
            return res.status(400).json({success: false, err });
    }
}

//fund account // approvisionner son compte 
module.exports.fundAccount = async (req, res) => {
    const email = req.body.id;
    const balance = req.body.balance;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
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
                    if(err) return res.status(500).json({success: false, message: "account not fund",  err});
                }
            );
            return res.status(201).json({ success: true, message: "account fund"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "account not fund", err});
   }
};


//update name
module.exports.updateName = async (req, res) => {
    const email = req.body.id;
    const name = req.body.name;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
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
                        return res.status(500).json({success: false, message: "Name not modified",  err});
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
    if(!(await AdultMemberModel.exists({ id: email})))
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
                    if(err) return res.status(500).json({success: false, message: "firstName not modified",  err});
                }
            );
        return res.status(201).json({ success: true, message: "firstName modified"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "firstName not modified", err});
   }
};

//update Age
module.exports.updateAge = async (req, res) => {
    const email = req.body.id;
    const age = req.body.age;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    try {
        //adult member
        await AdultMemberModel.findOneAndUpdate(
            {id: email}, 
            {
                $set: {
                    age: age
                    }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true},
            (err,docs) => {
                if(err) return res.status(500).json({success: false, message: "age not modified",  err});
            }
        );
        return res.status(201).json({ success: true, message: "age modified"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "age not modified", err});
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
                    if(err) return res.status(500).json({success: false, message: "child account not fund",  err});
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
                    if(err) return res.status(500).json({succes: false, message: "membership not purchased",  err});
                }
            );
            return res.status(201).json({ success: true, message: "membership purchased"});
        }else {
            return res.status(400).json({success: false, message: "insufficient balance"});
        }
    } catch (err) {
        return res.status(500).json({success: false, message: "membership not purchased", err});
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
                        res.json({success: false, message: "password not modified",  err});
                        return;
                    }
                }
            )
        return res.status(201).json({ success: true, message: "password modified"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "password not modified", err});
   }
};


//rent a resource //louer une resource
module.exports.rentResource = async (req, res) => {
    const email = req.body.id;
    const idResource = req.body.idResource;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
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
                        res.json({success: false, message: "password not modified",  err});
                        return;
                    }
                }
            )
        return res.status(201).json({ success: true, message: "password modified"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "password not modified", err});
   }
};


/*
//renew membershio // renouveller un abonnement renouvellement automatique pour les enfants egalement
module.exports.renewMembership = async (req, res) => {
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
                    if(err) return res.status(500).json({success: false, message: "membership not purchased",  err});
                }
            );
            return res.status(201).json({ success: true, message: "membership purchased"});
        }else {
            return res.status(400).json({success: false, message: "insufficient balance"});
        }
    } catch (err) {
        return res.status(500).json({success: false, message: "membership not purchased", err});
    }
};*/


