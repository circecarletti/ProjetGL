const AdultMemberModel = require('../models/adultmember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ResourceModel = require('../models/resource.model');
const LoanModel = require('../models/loan.model');

//informations user 
module.exports.userInfo = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email}) || await ManagerModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
    //adult  
    if(await AdultMemberModel.exists({id: email})){
         await AdultMemberModel.findOne({ id : email}, 'childList id age -_id')
            .populate('member', "-dateSubscription -password -nbFailConnection -id -__v -_id")  
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
            .populate('member', "-dateSubscription -password -nbFailConnection -id -__v -_id")   
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
    const firstName = req.body.firstName;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
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
                    if(err) return res.json({success: false, message: "firstName not modified",  err});
                }
            );
        return res.json({ success: true, message: "firstName modified"}); 
    } catch (err) {
        return res.json({success: false, message: "error firstName not modified", err});
   }
};

//update firstName
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
        releaseDate: req.body.releaseDate,
        type: req.body.type,
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
        await LoanModel.remove({idAdherent: id._id}).exec();  //remove loan associate to member
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
    const idResource = req.body.idResource;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
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
        return res.json({ success: true, message: "password modified"}); 
    } catch (err) {
        return res.json({success: false, message: "password not modified", err});
   }
};