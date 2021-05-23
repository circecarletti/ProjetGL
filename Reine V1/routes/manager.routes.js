const router = require('express').Router();
const managerController = require('../controllers/manager.controller');

//routes for manager is https://orsaymediatheque.herokuapp.com/api/user/manager

//get user info 
router.get('/:id', managerController.userInfo);

//delete user 
//router.delete('/:id', managerController.deleteUser);

//modifyBalance
router.post('/modifyBalance', managerController.modifyBalance);

//route update name
router.put('/updateName', managerController.updateName);

//route update firstname
router.put('/updateFirstName', managerController.updateFirstName);

//route update age
router.put('/updateAge', managerController.updateAge);

//unlockMember 
router.put('/unlockMember', managerController.unlockMember);

//rent a resource
//router.put('/rentResource', managerController.rentResource);

//createRessource
router.post('/createResource', managerController.createResource);

//route update password
//router.put('/updatePassword', userController.updatePassword);


module.exports = router;