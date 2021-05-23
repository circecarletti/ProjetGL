const AdultMemberModel = require('../models/adultmember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');
const LoanModel = require('../models/loan.model');
const ResourceModel = require('../models/resource.model');


//informations user 
module.exports.userInfo = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    try {
        //adult  
        await AdultMemberModel.findOne({ id : email}, 'childlist id age -_id')
            .populate('member', "-datesubscription -password -nbfailconnexion -id -__v -_id")
            .exec(function(err, docs){
                if(err){
                    return res.json({success: false, message : ' error get info adultmember', err});
                }
                return res.json({success: true, message:'success get adultmember info', docs});
            });
    }catch(err){
        console.log(err);
        return res.json({success: false, message : ' error get info adultmember', err});
    }
};

//informations user 
module.exports.getChildInfo = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});

    try {
        //adult  
        await AdultMemberModel.findOne({ id : email}, '-member -_id -id -age -__v')
        .populate({path:'childlist', select:'id age', populate:[{path:'member', select:'balance name firstname '}]})
        .exec(function(err, docs){
            if(err){
                return res.json({success: false, message : ' error get childinfo', err});
            }
            return res.json({success: true, message:'success get childinfo', docs});
        });
    } catch(err){
        console.log(err);
        return res.json({success: false, message : 'error childinfo get', err});
    }
};

//informations user 
module.exports.getLoanInfo = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    try {
        //adult  
        await AdultMemberModel.findOne({ id : email}, '-_id -id -age -childlist -__v')
        .populate({path:'member', select: 'member.loan -_id', populate:[{ path:'loan', select: '-_id -__v -idadherent', populate:[{path:'idresources', select:'-_id -idadherent'}]}]})
        .exec(function(err, docs){
                if(err){
                    return res.json({success: false, message : ' error get loan info', err});
                }
                res.json({success: true, message:'success get loan info', docs});
            });
    }catch(err){
        console.log(err);
        return res.json({success: false, message : 'error get loan info', err});
    }
};

//signup childmember
//fonction creerCompteMineur
module.exports.signUpChild = async (req, res) => {
    const {id, password, name, firstname, age, adultmember} = req.body

    try {
        //verifiy id not in manager collection
        if (await ManagerModel.exists({ id: id}))
            return res.json({success: false, message: 'ID manager existed'}); 

        //check existence of adultmember
        const userExists = await AdultMemberModel.exists({ id : adultmember }); 

        if(userExists){
            //creating member
            const member = await MemberModel.create({id, password, name, firstname, statut:'childmember'});

            //creating child member
            const user = await ChildMemberModel.create({id:id, age,adultmember:adultmember, member});

            const loan = await LoanModel.create({idadherent: member._id});
        
            await MemberModel.findOneAndUpdate({id:id}, {loan: loan._id},{new:true, upsert: true}, function(err, docs){
                if (err){
                    console.log(err);
                }else {
                    console.log("updated user docs ", docs);
                }
            });

            AdultMemberModel.findOneAndUpdate(
                { id: adultmember }, 
                { $push: { childlist: user._id } },
               function (error, success) {
                    if (error) {
                         console.log( error);
                         return;
                    } 
            });
            console.log('ChildMember successfully created!'); 
            return res.json({success: true, user: user.id});
        } else 
            return res.json({success: false, message: 'Adultmember not found'});
    }
    catch(err) {
        if(err.code == 11000){
            console.log(err)
            return res.json({success: false, message: 'ID existed', err});
        }
        else {
            console.log(err);
            return res.json({success: false, message:'error signup child', err });
        }
    }
}

//fund account // approvisionner son compte 
module.exports.fundAccount = async (req, res) => {
    const email = req.body.id;
    const balance = req.body.balance;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
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
                    if(err) return res.json({success: false, message: "account not fund",  err});
                }
            );
            return res.json({ success: true, message: "account fund"}); 
    } catch (err) {
        console.log(err);
        return res.json({success: false, message: "error account not fund", err});
   }
};


//update name
module.exports.updateName = async (req, res) => {
    const email = req.body.id;
    const name = req.body.name;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
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
                        return res.json({success: false, message: "Name not modified",  err});
                    }
                }
            );
        return res.json({ success: true, message: "name modified"}); 
    } catch (err) {
        return res.json({success: false, message: "name not modified", err});
   }
};

//update firstname
module.exports.updateFirstName = async (req, res) => {
    const email = req.body.id;
    const firstname = req.body.firstname;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
    try {
        MemberModel.findOneAndUpdate(
                {id: email}, 
                {
                    $set: {
                        firstname: firstname
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true},
                (err,docs) => {
                    if(err) return res.json({success: false, message: "firstname not modified",  err});
                }
            );
        return res.json({success: true, message: "firstname modified"}); 
    } catch (err) {
        return res.json({success: false, message: "error firstname not modified", err});
   }
};

//update Age
module.exports.updateAge = async (req, res) => {
    const email = req.body.id;
    const age = req.body.age;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
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
                if(err) return res.json({success: false, message: "age not modified",  err});
            }
        );
        return res.json({ success: true, message: "age modified"}); 
    } catch (err) {
        return res.json({success: false, message: "error age not modified", err});
   }
};

//fund account // approvisionner son compte 
module.exports.fundChildAccount = async (req, res) => {
    const email = req.body.id;
    const idChild = req.body.idChild;
    const balance = req.body.balance;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: idChild})))
        return res.json({success:'false', message: 'child account does not exist'});

    try {
        MemberModel.updateOne(
                {id: idChild}, 
                {
                    $inc: {
                        balance: balance
                    }
                },
                (err,docs) => {
                    if(err) return res.json({success: false, message: "child account not fund",  err});
                }
            )
        return res.json({ success: true, message: "child account fund"});
    } catch (err) {
        return res.json({success: false, message: "error child account not fund", err});
    }
};


//buy membershio // acheter un abonnement
module.exports.buyMembership = async (req, res) => {
    const email = req.body.id;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
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
                        datesubscription: new Date, 
                        subscribe: true
                    }
                },
                { new: true, upsert: true},
                (err,docs) => {
                    if(err) return res.json({succes: false, message: "membership not purchased",  err});
                }
            );
            return res.json({ success: true, message: "membership purchased"});
        }else {
            return res.json({success: false, message: "insufficient balance"});
        }
    } catch (err) {
        return res.json({success: false, message: "error membership not purchased", err});
    }
};

//update password
module.exports.updatePassword = async (req, res) => {
    const email = req.body.id;
    const password = req.body.password;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
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
        return res.json({ success: true, message: "password modified"}); 
    } catch (err) {
        return res.json({success: false, message: "error password not modified", err});
   }
};


//rent a resource //louer une resource
module.exports.rentResource = async (req, res) => {
    const email = req.body.id;
    const idResource = req.body.idresource;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});

    if(!(await ResourceModel.exists({ id: idResource})))
        return res.json({success:false, message:'resource does not exist'});
    
    try {
        const resource = await ResourceModel.findOne({ id : idResource});

        console.log('ok' + resource)

        if (resource.loan)
            return res.json({success:false, message:'resource is already borrowed'});

        await MemberModel.findOne({ id : email})
        .exec(function(err, docs) {
            if(err){
                console.log(err);
                return res.json({success:false, message:'error get infos user'});
            }
            console.log('ok' + docs)

            if(docs.balance < resource.price ) {
                return res.json({success:false, message:'insufficient balance'});
            }else if(docs.nbresource == 10) {
                return res.json({success:false, message:'number of resources equal to 10'});
            }else if(docs.block) {
                return res.json({success:false, message:'member is blocked and cannot borrow resources'});
            }
            else {
                if (docs.subscribe) {//if subscribe 30% reductions 
                    var price = Math.floor(resource.price * ( 1 - (30/100)));
                    console.log(price);
                } else{
                    var price = resource.price;
                }
                docs.balance = docs.balance - price;
                docs.nbresource = docs.nbresource + 1;
                docs.save();
                LoanModel.findOneAndUpdate({id: docs.loan},{ $push: { idresources: resource._id }}, {new: true, upsert: true},
                    function (error, success) {
                          if (error) {
                            return res.json({success: false, message: "error add resource to loan list", err});
                        } else {
                              console.log(success);
                          }});
                ResourceModel.findOneAndUpdate({id: resource.id}, {$set: {loan: true, idmember:docs._id } } ,
                    function (error, success) {
                        if (error) {
                            return res.json({success: false, message: "error add information to resource ", err});
                        } else {
                            console.log(success);
                        }
                    }
                );
            return res.json({success: true, message: 'the resource was borrowed at a cost of '+ price});    
            }
        });
    } catch (err) {
        return res.json({success: false, message: "error resource not borrowed", err});
   }
};

//return a resource //retourner  une resource
module.exports.returnResource = async (req, res) => {
    const email = req.body.id;
    const idResource = req.body.idresource;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});

    if(!(await ResourceModel.exists({ id: idResource})))
        return res.json({success:false, message:'resource does not exist'});
    
    try {

        await ResourceModel.findOneAndUpdate({id: idResource}, {$set: {loan: false, idmember:'' }} ,
            function (error, success) {
                if (error) {
                    return res.json({success: false, message: "error modify resource", err});
                } else {
                    console.log(success);
                }
            }
        );
        await LoanModel.findOneAndUpdate({id: docs.loan},{ $pull: { idresources: idResource }}, {safe: true, upsert: true},
            function (error, success) {
                  if (error) {
                    return res.json({success: false, message: "error pull resource from loan", err});
                } else {
                      console.log(success);
                  }
            }
        );

        await MemberModel.findOneAndUpdate({id: docs.loan}, {$inc: {nbresource: -1 }} ,
            function (error, success) {
                if (error) {
                    return res.json({success: false, message: "error modify resource", err});
                } else {
                    console.log(success);
                }
            }
        );
        return res.json({success: true, message: 'success returning the resource'});    
    } catch (err) {
        return res.json({success: false, message: "error returning the resource", err});
   }
};


/*
//renew membershio // renouveller un abonnement renouvellement automatique pour les enfants egalement
module.exports.renewMembership = async (req, res) => {
    const email = req.body.id;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
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
                        datesubscription: new Date, 
                        subscribe: true
                    }
                },
                { new: true, upsert: true},
                (err,docs) => {
                    if(err) return res.json({success: false, message: "membership not purchased",  err});
                }
            );
            return res.json({ success: true, message: "membership purchased"});
        }else {
            return res.json({success: false, message: "insufficient balance"});
        }
    } catch (err) {
        return res.json({success: false, message: "error membership not purchased", err});
    }
};*/


