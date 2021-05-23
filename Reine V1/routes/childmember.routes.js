const router = require('express').Router();
const childMemberController = require('../controllers/childmember.controller');

//child update ses infos ??

//get user info 
router.get('/:id', childMemberController.userInfo);


//route update name
router.put('/updateName', childMemberController.updateName);

//route update firstname
router.put('/updateFirstName', childMemberController.updateFirstName);

//route update age
router.put('/updateAge', childMemberController.updateAge);


//rent a resource
//router.put('/rentResource', childMemberController.rentResource);


module.exports = router;