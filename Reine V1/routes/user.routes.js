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

//user display : 'block',
router.get('/:id', userController.userInfo);

//get ressources
router.get('/ressource/search/', objController.SearchByFilter);

//update name
router.put("/:id", userController.updateName);

module.exports = router;
