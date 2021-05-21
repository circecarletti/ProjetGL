const router = require('express').Router();
const programmerController = require('../controllers/programmer.controller');

//route signup manager
router.post('/registerManager', programmerController.signUpManager);

module.exports = router;

