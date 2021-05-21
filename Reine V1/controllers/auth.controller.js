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
            return res.json({success: false, message: 'ID existed'}); 
        //creating member 
        const member = await MemberModel.create({id:id, password: password, name: name, firstName: firstName, balance: balance, statut: 'adultmember'});
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
        return res.json({ success: true, user: user.id }); 
    }
    catch(err) {
        console.log(err)
        if(err.code == 11000){
           return res.json({ success: false, message: 'ID existed' , err});
        }else if(err.errors && err.errors.name){
            return res.json({ success: false, message: 'error with name' , err});
        }else if(err.errors && err.errors.firstName){
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

//signin user  login 
module.exports.signIn = async (req, res) => {
    const {id, password} = req.body

    try{
        //if email is a member 
        if(await MemberModel.exists({ id: id})) {
            const userblock = await MemberModel.findOne({id: id}).select('block nbFailConnection -_id');
            //check if user is block
            if(userblock.block) {
                return res.json({success: false, message: 'user is block please contact manager'});
            }
            //login
            const user = await MemberModel.login(id, password);
            //create token for authentification
            const token = createToken(user.id);
            //create cookie with token
            res.cookie('jwt', token, {httpOnly: true, maxAge}); // create a cookie 
            res.json({success: true, message: 'authentification success', user:user.id, token:token, statut: user.statut}); //succes auth
        }
        else if (await ManagerModel.exists({ id: id})){
            //email is a manager 
            //login
            const user = await ManagerModel.login(id, password);
            //create token for authentification
            const token = createToken(user.id)
            //create cookie with token
            res.cookie('jwt', token, {httpOnly: true, maxAge}); // create a cookie httponly true : consult cookie only by our server 
            res.json({success: true, message: 'authentification success', user:user.id, token:token, statut: user.statut}); //succes auth
        }else {
            //email is not in database 
            return res.json({ success: false, message: 'email not in database'});
        }
    } catch(err){
        console.log(err);
        if(err.message.includes('email')) {
            res.json({ success: false, message: 'email unknow', err});
        } else if(err.message.includes('password')) {
            res.json({ success: false, message: 'password incorrect', err});
        }else {
            res.json({ success: false, message: 'error sign in', err});
        }
    }
}

//logout user
module.exports.logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1}); // cookie set time to 1milisseconds not valid anymore logout member
    res.redirect('/');
}