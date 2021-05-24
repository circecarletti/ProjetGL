const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');


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
        //adult  
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

//update name
module.exports.updateName = async (req, res) => {
    const email = req.body.id;
    const name = req.body.name;

    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: email})))
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

//update firstname
module.exports.updateFirstName = async (req, res) => {
    const email = req.body.id;
    const firstname = req.body.firstname;

    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: email})))
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

//update AGE
module.exports.updateAge = async (req, res) => {
    const email = req.body.id;
    const age = req.body.age;

    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});
    
    try {
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
    } catch (err) {
        return res.json({success: false, message: "error age not modified", err});
    }
};

//rent a resource //louer une resource
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

        const user = await MemberModel.findOne({ id : email}).exec();

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

//return a resource //retourner  une resource
module.exports.returnResource = async (req, res) => {
    const email = req.body.id;
    const idResource = req.body.idresource;
    console.log(idResource)
    console.log(email)

    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: email})))
        return res.json({success:false, message:'email not in database'});

    if(!(await ResourceModel.exists({ id: idResource})))
        return res.json({success:false, message:'resource does not exist'});

    try {
        console.log(idResource)
        const user = await MemberModel.findOne({ id : email});
        console.log(user.loan);
        const objid = await ResourceModel.findOne({ id : idResource});
        console.log(objid._id);

        if(!(await LoanModel.exists({_id: user._id, idresources: ObjectId(objid._id) } ))){
            return res.json({success: false, message: "resource is not borrowed", err});
        }

        await LoanModel.findOneAndUpdate( 
                { _id: user.loan }, 
                { $pull: { idresources: ObjectId(objid._id) } }, 
                { new: true }, 
                function(err, docs) {
                    if(err){
                        console.log(err)
                    }
                } 
        );

        await ResourceModel.findOneAndUpdate({id: idResource}, {$set: {loan: false, idmember: null }}, {upsert: true} ,
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


//update password
module.exports.updatePassword = async (req, res) => {
    const email = req.body.id;
    const password = req.body.password;

    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: email})))
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
