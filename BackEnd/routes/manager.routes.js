const router = require('express').Router();
const managerController = require('../controllers/manager.controller');

//routes for manager is https://orsaymediatheque.herokuapp.com/api/user/manager

//get managger info 
router.get('/:id', managerController.userInfo);

//getUsersInfo
router.get('/getUsersInfo/info', managerController.getUsersInfo);

//get users info
router.get('/getUserInfoById/:id', managerController.getUserInfoById);

//get user loan info
router.get('/getUserLoanInfo/:id', managerController.getUserLoanInfo);

//get Users Child Info
router.get('/getUserChildInfo/:id', managerController.getUserChildInfo);

//delete user member
router.delete('/:id', managerController.deleteUser);

//modifyBalance
router.post('/modifyBalance', managerController.modifyBalance);

//add member 
router.post('/addMember', managerController.addMember);

//route update name
router.put('/updateName', managerController.updateName);

//route update firstname
router.put('/updateFirstName', managerController.updateFirstName);

//route update age
router.put('/updateAge', managerController.updateAge);

//unlockMember 
router.put('/unlockMember', managerController.unlockMember);

//rent a resource
router.put('/addResourceToMember', managerController.addResourceToMember);

//createRessource
router.post('/createResource', managerController.createResource);

//return a resource 
router.put('/removeResourceToMember', managerController.removeResourceToMember);

//delete Resource
router.delete('/deleteResource/:id', managerController.deleteResource);

//route update password
router.put('/updatePassword', managerController.updatePassword);

module.exports = router;