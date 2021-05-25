const router = require('express').Router();
const adultMemberController = require('../controllers/adultmember.controller');

//routes for adultmember is https://orsaymediatheque.herokuapp.com/api/user/adultmember


//get user info 
router.get('/:id', adultMemberController.userInfo);

//get child info 
router.get('/childInfo/:id', adultMemberController.getChildInfo);

//get loan info 
router.get('/loanInfo/:id', adultMemberController.getLoanInfo);

//route signup childmember
router.post('/registerChild', adultMemberController.signUpChild);

//fund account // approvisionner son compte 
router.put('/fundAccount', adultMemberController.fundAccount);

//fund child account // approvisionner compte mineur
router.put('/fundChildAccount', adultMemberController.fundChildAccount);

//buy membership 
router.put('/buyMembership', adultMemberController.buyMembership);

//renew membershio // renouveller un abonnement renouvellement automatique pour les enfants egalement
router.put('/renewMembership', adultMemberController.renewMembership);

//rent a resource
router.put('/rentResource', adultMemberController.rentResource);

module.exports = router;
