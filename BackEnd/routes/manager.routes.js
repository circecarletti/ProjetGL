const router = require('express').Router();
const managerController = require('../controllers/manager.controller');

//routes for manager is https://orsaymediatheque.herokuapp.com/api/user/manager

//get managger info 
router.get('/:id', managerController.userInfo);

//get users info
router.get('/getUserInfo/:id', managerController.getUserInfo);

//get user loan info
router.get('/getUserLoanInfo/:id', managerController.getUserLoanInfo);

//get Users Child Info
router.get('/getUserChildInfo/:id', managerController.getUserChildInfo);

//delete user member
router.delete('/:id', managerController.deleteUser);

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
router.put('/rentResource', managerController.rentResource);

//createRessource
router.post('/createResource', managerController.createResource);

//return a resource 
router.put('/returnResource', managerController.returnResource);

//delete Resource
router.put('/deleteResource', managerController.deleteResource);

//route update password
router.put('/updatePassword', managerController.updatePassword);

module.exports = router;