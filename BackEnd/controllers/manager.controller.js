const AdultMemberModel = require('../models/adultmember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ResourceModel = require('../models/resource.model');
const LoanModel = require('../models/loan.model');
const ManagerModel = require('../models/manager.model');
const bcrypt = require('bcrypt');

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


//add Member
//fonction ajouter adherent 
module.exports.addMember = async (req, res) => {
    const {id, password, name, firstname, age, balance} = req.body

    try {
        //verifiy id not in manager collection
        if (await ManagerModel.exists({ id: id}))
            return res.json({success: false, message: 'ID existed'}); 
        //creating member 
        const member = await MemberModel.create({id:id, password: password, name: name, firstname: firstname, balance: balance, statut: 'adultmember'});
        //creating adultmember,  member included in adultmember
        const user = await AdultMemberModel.create({ id: id, age: age, member: member}); 

        const loan = await LoanModel.create({idadherent: member._id});
        
        await MemberModel.findOneAndUpdate({id:id}, {loan: loan._id},{new:true, upsert: true}, function(err, docs){
            if (err){
                console.log(err);
            }else {
                console.log("updated user docs ", docs);
            }
        });

        console.log('Member successfully created!'); 
        return res.json({ success: true, user: user.id }); 
    }
    catch(err) {
        console.log(err)
        if(err.code == 11000){
           return res.json({ success: false, message: 'ID existed' , err});
        }else if(err.errors && err.errors.name){
            return res.json({ success: false, message: 'error with name' , err});
        }else if(err.errors && err.errors.firstname){
            return res.json({ success: false, message: 'error with fistName' , err});
        }else if(err.errors && err.errors.age){
            return res.json({ success: false, message: 'error with age' , err});
        }else if(err.errors && err.errors.password){
            return res.json({ success: false, message: 'error with password' , err});
        }else {
            return res.json({ success: false, message:'erreur signup', err });
        }
    }
}

//get infos users
module.exports.getUsersInfo = async (req, res) => {
    //if no query send with get 
    if (((req.query === {}) || (req.query.name === undefined ) || (req.query.name === '' ))) {
        return res.send({success: false, message: 'error params name users'});
    }

    const name = req.query.name;
    console.log(name)

    try {
        //search in author or title
        const query = {
            $or: [ 
                { "name" : { $regex: '.*' + name + '.*' }}, 
                { "firstname" : { $regex: '.*' + name + '.*' }},
                { "id" : { $regex: '.*' + name + '.*' }}
            ]
        };

        await MemberModel.find(query,'-_id -password -__v', function(err, docs) {
            if(err){
                return res.send({success: false, message : 'error get infos users', err});
            }
            if (docs.length){
                return res.send({success: true,message:'success get infos users' , docs});
            } else {
                return res.send({success: false, message : 'users not found', err});
            }
        });
    }
    catch(err){
        return res.send({ success: false, message: "error get infos users"}); 
    }
};



//informations user 
module.exports.getUserInfoById = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    try{
        //adult  
        if(await AdultMemberModel.exists({id: email})){
            await AdultMemberModel.findOne({ id : email}, 'childList id age -_id')
                .populate('member', " -password -id -__v -_id")  
                .populate('childlist')
                .then(function(docs){
                    console.log('mail ' + email);
                    return res.json({success: true, message: 'success get user info',docs});
                })
                .catch(function(err) {
                    return res.json({success: false, message : 'error email', err});
                });
        }
        //child
        else {
            await ChildMemberModel.findOne({ id : email}, '-__v -_id')
                .populate('member', " -password -id -__v -_id")   
                .then(function(docs){
                    return res.json({success:true, message:'success get user info', docs});
                })
                .catch(function(err) {
                    return res.json({success: false, message : 'error email', err});
                });
            }
    }catch(err){
        return res.json({success: false, message : 'error get users info', err});
    }
};


//informations user 
module.exports.getUserLoanInfo = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    try {
        const user =  await MemberModel.findOne({ id : email});
        if (user.statut === 'adultmember'){
        //adult  
        await AdultMemberModel.findOne({ id : email}, '-_id -id -age -childlist -__v')
        .populate({path:'member', select: 'member.loan -_id', populate:[{ path:'loan', select: '-_id -__v -idadherent', populate:[{path:'idresources', select:'-_id -idadherent'}]}]})
        .exec(function(err, docs){
                if(err){
                    return res.json({success: false, message : ' error get loan info', err});
                }
                return res.json({success: true, message:'success get loan info', docs});
            });
        }else {
        //child  
        await ChildMemberModel.findOne({ id : email}, ' -_id -id -age -__v -adultmember')
        .populate({path:'member', select: 'member.loan -_id', populate:[{ path:'loan', select: '-_id -__v -idadherent', populate:[{path:'idresources', select:'-_id -idadherent'}]}]})
        .exec(function(err, docs){
                if(err){
                    return res.json({success: false, message : ' error get info childinfo', err});
                }
                return res.json({success: true, message:'success get info childinfo', docs});
            });
        }
    }catch(err){
        console.log(err);
        return res.json({success: false, message : 'error get loan info', err});
    }
};

//informations user 
module.exports.getUserChildInfo = async (req, res) => {
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
        const user = await MemberModel.findOne({id: email}).select('block -_id');
        console.log(user);

        if(!user.block) 
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
        synopsis: (req.body.synopsis) ? req.body.synopsis : '',
        picture:  (req.body.picture) ? req.body.picture : "covers/random-cover1.jpg"
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
        const user = await MemberModel.findOne({id: email});

        if(user.balance < 0) 
            return res.json({success: false, message: 'cannot delete the member because the balance is negative'});

        if(user.nbresource > 0) 
            return res.json({success: false, message: 'cannot delete member beacause there are borrowed resources '});

        if(user.lock) 
            return res.json({success: false, message: 'cannot delete member beacause is lock'});

        await LoanModel.deleteOne({idadherent: user._id})  //remove loan associate to member
        await MemberModel.deleteOne({id: email}); //remove member

        if(user.statut === 'adultmember'){
            await AdultMemberModel.deleteOne({id: email});  //remove adult member
        }else {
            await ChildMemberModel.deleteOne({id: email});  //remove child  member
        }
        return res.json({ success: true, message: "member successfully deleted"}); 
    } catch (err) {
        return res.json({success: false, message: "error deleting member", err});
   }
};

//deleteResource
module.exports.deleteResource = async (req, res) => {
    const id = req.params.id;

    //check if email is in the database
    if(!(await ResourceModel.exists({ id: id})))
        return res.json({success:false, message:'resource not in database'});
    
    try {
        //verify if member is lock
        const resource = await ResourceModel.findOne({id: id});

        if(resource.loan) 
            return res.json({success: false, message: 'cannot delete the resource because it is borrowed'});

        await ResourceModel.deleteOne({id: id})  //remove loan associate to member
     
        return res.json({ success: true, message: "resource deleted"}); 
    } catch (err) {
        return res.json({success: false, message: "resource not deleted", err});
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
        const salt = await bcrypt.genSalt();
        newpassword = await bcrypt.hash(password, salt);
        MemberModel.findOneAndUpdate(
                {id: email}, 
                {
                    $set: {
                        password: newpassword
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
module.exports.addResourceToMember = async (req, res) => {
    const email = req.body.id;
    const idResource = req.body.idresource;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});

    if(!(await ResourceModel.exists({ id: idResource})))
        return res.json({success:false, message:'resource does not exist'});
                                       
    try {
        const resource = await ResourceModel.findOne({ id : idResource});

        if (resource.loan)
            return res.json({success:false, message:'resource is already borrowed'});

        const user = await MemberModel.findOne({ id : email}).exec();

        if(user.statut === 'childmember' && resource.category === 'adult') {
            return res.json({success:false, message:'resource for adult cannot be borrowed by a child'}); 
        }

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
        return res.json({success: true, message: 'the resource was borrowed at a cost of '+ price , resource: resource });    
    } catch (err) {
        return res.json({success: false, message: "error resource not borrowed", err});
   }
};

//return a resource //retourner  une resource
module.exports.removeResourceToMember = async (req, res) => {
    const email = req.body.id;
    const idResource = req.body.idresource;
    console.log(idResource)
    console.log(email)

    if(email === '' || idResource === ''){
        return res.json({success:false, message:'error params empty'});
    }

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});

    if(!(await ResourceModel.exists({ id: idResource})))
        return res.json({success:false, message:'resource does not exist'});

    try {
        const user = await MemberModel.findOne({ id : email});
        const objid = await ResourceModel.findOne({ id : idResource});

        if(((typeof objid.idmember) === "undefined") || (objid.loan == false ) || (objid.idmember === null) ){
            console.log('okkk')
            return res.json({success: false, message: "resource is not borrowed"});
        }


        if(!((objid.idmember).toString() ===  user._id.toString()) ){
            return res.json({success: false, message: "resource is not borrowed by this member"});
        }

        LoanModel.findOneAndUpdate( 
            { _id: user.loan }, 
            { $pull: { idresources: objid._id } }, 
            { new: true }, 
            function(err) {
                if(err){
                    console.log(err)
                }
            } 
        );

        await ResourceModel.findOneAndUpdate({id: idResource}, {$set: {loan: false, idmember: null, loanday: Number(30) }}, {upsert: true} ,
            function (err, success) {
                if (err) {
                    return res.json({success: false, message: "error modify resource", err});
                } else {
                    console.log(success);
                }
            }
        );

        MemberModel.findOneAndUpdate({id: email}, {$inc: {nbresource: -1 }} ,
            function (err, success) {
                if (err) {
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
