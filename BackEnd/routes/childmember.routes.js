const router = require('express').Router();
const childMemberController = require('../controllers/childmember.controller');

//routes for childmember is https://orsaymediatheque.herokuapp.com/api/user/childmember

// http://localhost:5000/api/user/childmember  (local)


//child update ses infos ??

//get user info 
router.get('/:id', childMemberController.userInfo);

//get loan info 
router.get('/loanInfo/:id', childMemberController.getLoanInfo);

//rent a resource
router.put('/rentResource', childMemberController.rentResource);


module.exports = router;