const AdultMemberModel = require('../models/adultmember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');
const LoanModel = require('../models/loan.model');
const ResourceModel = require('../models/resource.model');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')


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

        const adultmemberrattached = await AdultMemberModel.findOne({ id : adultmember }).populate('member'); 


        if(userExists){
            //creating member //if adult is subscribe suscription for child too
            const member = await MemberModel.create({id, password, name, firstname, statut:'childmember', subscribe: adultmemberrattached.member.subscribe});
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
               function (err, success) {
                    if (err) {
                         console.log( err);
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
    console.log(email)
    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
    try {
        const user = await MemberModel.findOne({id: email});

        if(user.subscribe)
            return res.json({success:false, message:'member already suscribed'});

        if(user.balance >= 100 ){
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
                {upsert: true},
                async function (err, docs) {
                    if(err) return res.json({succes: false, message: "membership not purchased",  err});
                    const objectchild = await AdultMemberModel.findOne({id: email}, 'childlist -_id').exec(); 
                    //if adult member have children
                    if(objectchild.childlist.length >0){
                        const objectchildpopulate = await objectchild.populate('childlist').execPopulate();
                        const IdArray =  (objectchildpopulate.childlist).map( function( a ){ return a.member; });
                        MemberModel.updateMany({_id : {$in: IdArray } }, {$set: { datesubscription: new Date, subscribe: true }}, { upsert:true } ,
                        function (err) {
                            if (err){
                            console.log(err);
                            }
                        });
                    }
                });
            return res.json({ success: true, message: "membership purchased"});
        }else {
            return res.json({success: false, message: "insufficient balance"});
        }
    } catch (err) {
        return res.json({success: false, message: "error membership not purchased", err});
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

        if (resource.loan)
            return res.json({success:false, message:'resource is already borrowed'});

        const user = await MemberModel.findOne({ id : email});

        if(user.balance < resource.price ) {
            return res.json({success:false, message:'insufficient balance'});
        }else if(user.nbresource == 10) {
            return res.json({success:false, message:'number of resources equal to 10'});
        }else if(user.block) {
            return res.json({success:false, message:'member is blocked and cannot borrow resources'});
        }
        if (user.subscribe) {//if subscribe 30% reductions 
            var price = Math.floor(resource.price * ( 1 - (30/100)));
        } else{
            var price = resource.price;
        }
        console.log(price);
        const balance = user.balance - price;
        const nbresource = user.nbresource + 1;
        
        await MemberModel.findOneAndUpdate({id: email},{$set: {balance: balance, nbresource : nbresource}} ,{upsert: true}, function(err, docs) {
            if(err){
                console.log(err);
                return res.json({success:false, message:'error get infos user'});
            }
        });

        LoanModel.findOneAndUpdate({_id: user.loan}, { $push: { idresources: resource._id }}, {new:true, upsert: true},
            function (err, success) {
                    if (err) {
                    return res.json({success: false, message: "error add resource to loan list", err});
                } else {
                        console.log(success);
                }});

        await ResourceModel.findOneAndUpdate({id: resource.id}, {$set: {loan: true, idmember:user._id } } ,
            function (err, success) {
                if (err) {
                    return res.json({success: false, message: "error add information to resource ", err});
                } else {
                    console.log(success);
                }
        });
        return res.json({success: true, message: 'the resource was borrowed at a cost of '+ price});    
    } catch (err) {
        return res.json({success: false, message: "error resource not borrowed", err});
   }
};

//renew membershio // renouveller un abonnement renouvellement automatique pour les enfants egalement
module.exports.renewMembership = async (req, res) => {
    const email = req.body.id;

    //check if email is in the database
    if(!(await AdultMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
    try {
        const user = await MemberModel.findOne({id: email});
        console.log(balance);
        if(!user.subscribe) {
            return res.json({success: false, message: "user cannot renew because not suscribe",  err});
        }
        var d = new Date(user.datesubscription);
        console.log(d)
        d.setMonth(d.getMonth() + 9);
        if(new Date() <= d){
            return res.json({success: false, message: "user cannot renew because it is not 3 month before end of susbcription",  err});
        }

        if(user.balance >= 100 ) {
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
                async function (err, docs) {
                    if(err) return res.json({succes: false, message: "membership not renewed",  err});
                    const objectchild = await AdultMemberModel.findOne({id: email}, 'childlist -_id').exec(); 
                    //if adult member have children
                    if(objectchild.childlist.length >0){
                        const objectchildpopulate = await objectchild.populate('childlist').execPopulate();
                        const IdArray =  (objectchildpopulate.childlist).map( function( a ){ return a.member; });
                        MemberModel.updateMany({_id : {$in: IdArray } }, {$set: { datesubscription: new Date, subscribe: true }}, { upsert:true } ,
                        function (err) {
                            if (err){
                            console.log(err);
                            }
                        });
                    }
                });
            return res.json({ success: true, message: "membership renew"});
        }else {
            return res.json({success: false, message: "insufficient balance"});
        }
    } catch (err) {
        return res.json({success: false, message: "error membership not purchased", err});
    }
};