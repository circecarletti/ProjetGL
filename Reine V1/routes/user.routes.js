const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

//auth 
//route signup adultmember
router.post("/register", authController.signUp);

//route signup childmember
router.post("/registerChild", authController.signUpChild);

//route signup manager
router.post("/registerManager", authController.signUpManager);

//user display : 'block',
router.get('/:email', userController.userInfo);
module.exports = router;