const router = require('express').Router();
const authController = require('../controllers/auth.controller');

//routes for users is https://orsaymediatheque.herokuapp.com/api/users


//auth 
//route signup adultmember
router.post('/register', authController.signUp);

//route login
router.post('/login', authController.signIn);

//route logout 
router.get('/logout', authController.logout);

module.exports = router;