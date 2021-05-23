const router = require('express').Router();
const resourceController = require('../controllers/resource.controller');

//routes for resource is https://orsaymediatheque.herokuapp.com/api/resource

router.get('/', resourceController.getResources);

router.get('/searchFilter', resourceController.SearchByFilter);

router.get('/:id', resourceController.getResourceByID)

module.exports = router;