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
            .populate('member', "-dateSubscription -password -nbFailConnection -id -__v -_id")   
            .then(function(docs){
                return res.json({success: true, message: 'get child info ok ',docs});
            })
            .catch(function(err) {
                res.json({success: false, message : 'error email', err});
                return;
        });
    }catch(err){
        console.log(err);
        return res.json({success: false, message : 'error get child info', err});
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

//update firstName
module.exports.updateFirstName = async (req, res) => {
    const email = req.body.id;
    const firstName = req.body.firstName;

    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: email})))
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
        return res.json({success: false, message: "error password not modified", err});
   }
};
