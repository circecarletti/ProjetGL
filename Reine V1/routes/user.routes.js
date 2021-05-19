const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const objController = require('../controllers/object.controller');

//auth 
//route signup adultmember
router.post("/register", authController.signUp);

//route signup childmember
router.post("/registerChild", authController.signUpChild);

//route signup manager
router.post("/registerManager", authController.signUpManager);

//createRessource
router.post("/createRessource", userController.createRessource);

//get user info 
router.get('/:id', userController.userInfo);

//delete user 
router.delete('/:id', userController.deleteUser);

//route update name
router.put("/updateName", userController.updateName);

//route update firstname
router.put("/updateFirstName", userController.updateFirstName);

//route update age
router.put("/updateAge", userController.updateAge);

//route update password
//router.put("/updatePassword", userController.updatePassword);

//fund account // approvisionner son compte 
router.put("/fundAccount", userController.fundAccount);

//fund child account // approvisionner compte mineur
router.put("/fundChildAccount", userController.fundChildAccount);

//rent a ressource
router.put("/rentRessource", userController.rentRessource);

//buy membership 
router.put("/buyMembership", userController.buyMembership);

//unlockMember 
router.put("/unlockMember", userController.unlockMember);


module.exports = router;
/*
//get ressources
router.get('/ressource/search/', objController.SearchByFilter);
*/