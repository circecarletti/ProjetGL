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

        console.log('ok' + resource)

        if (resource.loan)
            return res.json({success:false, message:'resource is already borrowed'});
        
        if (resource.category === 'adult')
            return res.json({success:false, message:'resource for adult cannot be borrowed by a child'});    

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
                LoanModel.findOneAndUpdate({id: docs.loan},{ $push: { idresources: resource._id } }, {new: true, upsert: true},
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