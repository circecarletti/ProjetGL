const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const LoanModel = require('../models/loan.model');
const ResourceModel = require('../models/resource.model');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')

//informations user 
module.exports.userInfo = async (req, res) => {
    const email = req.params.id;
    try{
        //check if email is in the database
        if(!(await ChildMemberModel.exists({ id: email})))
            return res.json({success:false, message:'email not in database'});

        //child
        await ChildMemberModel.findOne({ id : email}, '-__v -_id')
        .populate('member', "-datesubscription -password -nbfailconnexion -id -__v -_id")
        .exec(function(err, docs){
            if(err){
                return res.json({success: false, message : 'get child info ok', err});
            }
                return res.json({success: true, message:'success get child info', docs});
        });
    }catch(err){
        console.log(err);
        return res.json({success: false, message : 'error get child info', err});
    }
};

//informations user 
module.exports.getLoanInfo = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    try {
        //child  
        await ChildMemberModel.findOne({ id : email}, ' -_id -id -age -__v -adultmember')
        .populate({path:'member', select: 'member.loan -_id', populate:[{ path:'loan', select: '-_id -__v -idadherent', populate:[{path:'idresources', select:'-_id -idadherent'}]}]})
        .exec(function(err, docs){
                if(err){
                    return res.json({success: false, message : ' error get info childinfo', err});
                }
                res.json({success: true, message:'success get info childinfo', docs});
            });
    }catch(err){
        console.log(err);
        return res.json({success: false, message : 'error get info childinfo', err});
    }
};


//rent a resource //louer une resource ////////////////////
module.exports.rentResource = async (req, res) => {
    const email = req.body.id;
    const idResource = req.body.idresource;

    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});

    if(!(await ResourceModel.exists({ id: idResource})))
        return res.json({success:false, message:'resource does not exist'});
                                       
    try {
        const resource = await ResourceModel.findOne({ id : idResource});

        if (resource.loan)
            return res.json({success:false, message:'resource is already borrowed'});

        if (resource.category === 'adult')
            return res.json({success:false, message:'resource for adult cannot be borrowed by a child'});   

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

