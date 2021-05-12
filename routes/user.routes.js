const router = require('express').Router();
const authController = require('../controllers/auth.controller');

//route signup adultmember
router.post("/register", authController.signUp);

//route signup childmember
router.post("/registerChild", authController.signUpChild);

//route signup manager
router.post("/registerManager", authController.signUpManager);

module.exports = router;