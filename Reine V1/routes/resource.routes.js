const router = require('express').Router();
const resourceController = require('../controllers/resource.controller');

router.get('/', resourceController.getResources);

router.get('/searchFilter', resourceController.SearchByFilter);

router.get('/:id', resourceController.getResourceByID)

module.exports = router;
