const router = require('express').Router();
const programmerController = require('../controllers/programmer.controller');

//routes for programmer is https://orsaymediatheque.herokuapp.com/api/programmer

//route signup manager
router.post('/registerManager', programmerController.signUpManager);

module.exports = router;

