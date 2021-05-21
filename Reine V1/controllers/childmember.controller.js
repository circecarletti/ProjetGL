const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');


//informations user 
module.exports.userInfo = async (req, res) => {
    const email = req.params.id;

    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
    //child
    await ChildMemberModel.findOne({ id : email}, '-__v -_id')
        .populate('member', "-dateSubscription -password -nbFailConnection -id -__v -_id")   
        .then(function(infomembers){
            return res.status(200).json(infomembers);
        })
        .catch(function(err) {
            return res.status(400).json({success: true, message : 'error email', err});
    });
};


//update name
module.exports.updateName = async (req, res) => {
    const email = req.body.id;
    const name = req.body.name;

    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: email})))
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
    if(!(await ChildMemberModel.exists({ id: email})))
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

//update AGE
module.exports.updateAge = async (req, res) => {
    const email = req.body.id;
    const age = req.body.age;

    //check if email is in the database
    if(!(await ChildMemberModel.exists({ id: email})))
        return res.status(400).json('email not in database : ' + email);
    
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
                if(err) return res.status(500).json({success: false, message: "age not modified",  err});
            }
        );
        return res.status(201).json({ success: true, message: "age modified"}); 
    } catch (err) {
        return res.status(500).json({success: false, message: "age not modified", err});
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