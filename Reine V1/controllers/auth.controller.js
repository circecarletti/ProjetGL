const AdultMemberModel = require('../models/adultmember.model');
const MemberModel = require('../models/member.model');
const ChildMemberModel = require('../models/childmember.model');
const ManagerModel = require('../models/manager.model');
const LoanModel = require('../models/loan.model');
const jwt = require('jsonwebtoken');


const maxAge = 3 * 24 * 60 * 60 * 1000 // 3 day in milliseconds
//create token (jeton) for authentification check
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge    // token is valid 3 day
    })
};

//signup member
//fonction inscription 
module.exports.signUp = async (req, res) => {
    const {id, password, name, firstName, age, balance} = req.body

    try {
        //verifiy id not in manager collection
        if (await ManagerModel.exists({ id: id}))
            return res.status(409).json({success: false, message: 'ID existed'}); 
        //creating member 
        const member = await MemberModel.create({id:id, password: password, name: name, firstName: firstName, balance: balance, statut: 'adultMember'});
        //creating adultmember,  member included in adultmember
        const user = await AdultMemberModel.create({ id: id, age: age, member: member}); 

        const loan = await LoanModel.create({idAdherent: member._id});
        
        await MemberModel.findOneAndUpdate({id:id}, {loan: loan._id},{new:true, upsert: true}, function(err, docs){
            if (err){
                console.log(err);
            }else {
                console.log("updated user docs ", docs);
            }
        });

        console.log('Member successfully created!'); 
        return res.status(201).json({ success: true, user: user.id }); 
    }
    catch(err) {
        if(err.code == 11000)
           return res.status(409).json({ success: false, message: 'ID existed' , err});
        else 
            return res.status(400).send({ success: false, err });
    }
}


//signin user 
module.exports.signIn = async (req, res) => {
    const {email, password} = req.body

    try{
        //if email is a member 
        if(await MemberModel.exists({ id: email})) {
            const userblock = await MemberModel.findOne({id: email}).select('block nbFailConnection -_id');
            //check if user is block
            if(userblock.block) {
                return res.status(400).json({success: false, message: 'user is block please contact manager'});
            }
            //login
            const user = await MemberModel.login(email, password);
            //create token for authentification
            const token = createToken(user.id);
            //create cookie with token
            res.cookie('jwt', token, {httpOnly: true, maxAge}); // create a cookie 
            res.status(200).json({success: true, message: 'authentification success', user:user.id}); //succes auth
        }
        else if (await ManagerModel.exists({ id: email})){
            //email is a manager 
            //login
            const user = await ManagerModel.login(email, password);
            //create token for authentification
            const token = createToken(user.id)
            //create cookie with token
            res.cookie('jwt', token, {httpOnly: true, maxAge}); // create a cookie httponly true : consult cookie only by our server 
            res.status(200).json({success: true, message: 'authentification success', user:user.id}); //succes auth
        }else {
            //email is not in database 
            return res.status(400).json({ success: false, message: 'email not in database'});
        }
    }
    catch(err){
        res.status(400).json(err);
    }
}

//logout user
module.exports.logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1}); // cookie set time to 1milisseconds not valid anymore logout member
    res.redirect('/');
}