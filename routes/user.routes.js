const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.post("/register", authController.signUp);

router.post("/registerChild", authController.signUpChild);

router.post("/registerManager", authController.signUpManager);

module.exports = router;