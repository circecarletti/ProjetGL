const router = require('express').Router();
const resourceController = require('../controllers/resource.controller');

//routes for resource is https://orsaymediatheque.herokuapp.com/api/resource

router.get('/', resourceController.getResources);

router.get('/searchFilter', resourceController.SearchByFilter);

router.get('/:id', resourceController.getResourceByID);

router.get('/getAvailable/:id', resourceController.getResourceAvailable);

router.get('/getNouveaute/news', resourceController.getNouveaute);

module.exports = router;