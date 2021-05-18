const AdultMemberModel = require('../models/adultMember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');
const ResourceModel = require('../models/resource.model');


//informations user 
module.exports.userInfo = async (req, res) => {

    const email = req.params.id;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email}) || await ManagerModel.exists({ id: email})))
        return res.status(400).send('email not in database : ' + email);
    
    //adult  
    if(await AdultMemberModel.exists({id: email})){
         await AdultMemberModel.findOne({ id : email}, 'childList id age -_id')
            .populate('member', "-dateSubscription -password -nbFailConnection -id -__v -_id")  
            .then(function(infomembers){
                console.log('mail ' + email);
                return res.status(200).json(infomembers);
            })
            .catch(function(err) {
                return res.status(400).json({success: true, message : ' error email', err});
            });
    }
    //child
    else if(await ChildMemberModel.exists({id: email})){
        await ChildMemberModel.findOne({ id : email}, '-__v -_id')
            .populate('member', "-dateSubscription -password -nbFailConnection -id -__v -_id")   
            .then(function(infomembers){
                return res.status(200).json(infomembers);
            })
            .catch(function(err) {
                return res.status(400).json({success: true, message : 'error email', err});
            });
    }
    else { // manager
        await ManagerModel.findOne({id : email }, '-password -__v -_id')
            .then(function(infomanagers){
                return res.status(200).json(infomanagers);
            })
            .catch(function(err) {
                return res.status(400).json({succes : false, message : 'error email', err});
            });
    };
};


module.exports.updateName = async (req, res) => {
    const email = req.params.id;
    const agemember = req.params.age;

    //check if email is in the database
    if(!(await MemberModel.exists({ id: email})))
        return res.status(400).send('email not in database : ' + email);
    
    try {
        if(await AdultMemberModel.exists({id: email})){
            await AdultMemberModel.findByIdAndUpdate(
                {id: email}, 
                {
                    $set: {
                        age: agemember
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true},
                (err,docs) => {
                    if (!err) return res.send(docs);
                    if(err) return res.status(500).send({succes: false, message: err});
                }
            )
       }
       else {
           await ChildMemberModel.findByIdAndUpdate(
            {id: email}, 
            {
                $set: {
                    age: agemember
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true},
            (err,docs) => {
                if (!err) return res.send(docs);
                if(err) return res.status(500).send({succes: false, message: err});
            }
        )
       }     
    } catch (err) {
        return res.status(500).json({succes: false, message: err});
   }
};