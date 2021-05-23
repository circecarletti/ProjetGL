const AdultMemberModel = require('../models/adultmember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ResourceModel = require('../models/resource.model');
const LoanModel = require('../models/loan.model');
const ManagerModel = require('../models/manager.model');

//informations user 
module.exports.userInfo = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await ManagerModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    try{
    // manager
        await ManagerModel.findOne({id : email }, '-password -__v -_id')
            .then(function(docs){
                return res.json({success:true, message: 'success get info', docs});
            })
            .catch(function(err) {
                return res.json({success : false, message : 'get error get manager info', err});
            });
    }catch(err){
        return res.json({success: false, message : 'error manager info', err});
    }
};

//informations user 
module.exports.getUsersInfo = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email}) || await ManagerModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
    //adult  
    if(await AdultMemberModel.exists({id: email})){
         await AdultMemberModel.findOne({ id : email}, 'childList id age -_id')
            .populate('member', "-datesubscription -password -nbfailconnexion -id -__v -_id")  
            .then(function(docs){
                console.log('mail ' + email);
                return res.json({success: true, message: 'success get user info',docs});
            })
            .catch(function(err) {
                return res.json({success: true, message : 'error email', err});
            });
    }
    //child
    else if(await ChildMemberModel.exists({id: email})){
        await ChildMemberModel.findOne({ id : email}, '-__v -_id')
            .populate('member', "-datesubscription -password -nbfailconnexion -id -__v -_id")   
            .then(function(docs){
                return res.json({success:true, message:'success get user info', docs});
            })
            .catch(function(err) {
                return res.json({success: true, message : 'error email', err});
            });
    }
    else { // manager
        await ManagerModel.findOne({id : email }, '-password -__v -_id')
            .then(function(docs){
                return res.json({success:true, message: 'success get info', docs});
            })
            .catch(function(err) {
                return res.json({success : false, message : 'error email', err});
            });
    };
};


//fund account // approvisionner son compte 
module.exports.modifyBalance = async (req, res) => {
    const email = req.body.id;
    const balance = req.body.balance;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
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
        return res.json({success: false, message: "error account not fund", err});
   }
};


//update name
module.exports.updateName = async (req, res) => {
    const email = req.body.id;
    const name = req.body.name;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
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
        return res.json({success: false, message: "error name not modified", err});
   }
};

//update firstName
module.exports.updateFirstName = async (req, res) => {
    const email = req.body.id;
    const firstname = req.body.firstname;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
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
        return res.json({ success: true, message: "firstname modified"}); 
    } catch (err) {
        return res.json({success: false, message: "error firstname not modified", err});
   }
};

//update firstname
module.exports.updateAge = async (req, res) => {
    const email = req.body.id;
    const age = req.body.age;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
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
                    if(err) return res.json({success: false, message: "age not modified",  err});
                }
            );
            return res.json({ success: true, message: "age modified"}); 
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
                    if(err) return res.json({success: false, message: "age not modified",  err});
                }
            );
            return res.json({ success: true, message: "age modified"}); 
        }
    } catch (err) {
        return res.json({success: false, message: "age not modified", err});
   }
};


//unlock a member  /debloquer un adherent
module.exports.unlockMember = async (req, res) => {
    const email = req.body.id;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
    try {
        const lock = await MemberModel.findOne({id: email}).select('block -_id');
        console.log(lock);
        if(!lock.lock) 
            return res.json({success: false, message: 'member not lock'});
        
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
                        res.json({success: false, message: "member not unlocked",  err});
                        return;
                    }
                }
            )
        return res.json({ success: true, message: "member unlock"}); 
    } catch (err) {
        return res.json({success: false, message: "member not unlocked", err});
   }
};

//createResource
module.exports.createResource = async (req, res) => {
    const newResource = new ResourceModel({
        title: req.body.title,
        category: req.body.category,
        author: req.body.author, 
        releasedate: req.body.releasedate,
        type: req.body.type,
        price: req.body.price,
        resume: (req.body.resume) ? req.body.resume : '',
        synopsis: (req.body.synopsis) ? req.body.synopsis : ''
    });

    try {
        const resource = await newResource.save();
        console.log(resource)
        return res.json({success: true, message:'resource created', id: resource.id}); 
    }
    catch(err) {
        return res.json({ success: false, message: 'error creating resource', err });
    }
}


//fund account // approvisionner son compte 
module.exports.modifyBalance = async (req, res) => {
    const email = req.body.id;
    const balance = req.body.balance;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
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
        return res.json({success: false, message: "error account not fund", err});
   }
};

//deleteUser
module.exports.deleteUser = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
    try {
        //verify if member is lock
        const lock = await MemberModel.findOne({id: email}).select('block -_id');
        console.log(lock);
        if(lock.lock) 
            return res.json({success: false, message: 'member not delete member is lock'});

        const id = await MemberModel.findOne({id: email}).select('_id');
        await LoanModel.remove({idadherent: id._id}).exec();  //remove loan associate to member
        await MemberModel.remove({id: email}).exec();  //remove member

        if(await AdultMemberModel.exists({id: email})){
            await AdultMemberModel.remove({id: email}).exec();  //remove adult member
        }else {
            await ChildMemberModel.remove({id: email}).exec();  //remove child  member
        }
        return res.json({ success: true, message: "member deleted"}); 
    } catch (err) {
        return res.json({success: false, message: "error deleting member", err});
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
        return res.json({success: false, message: "password not modified", err});
   }
};


//rent a resource //louer une resource
module.exports.rentResource = async (req, res) => {
    const email = req.body.id;
    const idResource = req.body.idresource;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
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
            }else if(docs.statut === 'childmember' && resource.category === 'adult') {
                return res.json({success:false, message:'resource for adult cannot be borrowed by a child'}); 
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
                              console.log(error);
                          } else {
                              console.log(success);
                          }});
                ResourceModel.findOneAndUpdate({id: resource.id}, {$set: {loan: true, idmember:docs._id } } ,
                    function (error, success) {
                        if (error) {
                            console.log(error);
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
    if(!(await MemberModel.exists({ id: email})))
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
