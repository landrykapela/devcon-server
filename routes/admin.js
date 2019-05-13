const express = require('express');

const router = express.Router();
const categoryController = require('../controllers/category');
const skillController = require('../controllers/skill');
const languageController = require('../controllers/language');
const devController = require('../controllers/developer');

router.get('/categories', categoryController.getAll);
router.post('/categories', categoryController.create);
router.get('/categories/:id', categoryController.find);
router.put('/categories/:id', categoryController.update);
router.delete('/categories/:id', categoryController.delete);

router.get('/skills', skillController.getAll);
router.post('/skills', skillController.create);
router.get('/skills/:id', skillController.find);
router.put('/skills/:id', skillController.update);
router.delete('/skills/:id', skillController.delete);

router.get('/languages', languageController.getAll);
router.post('/languages', languageController.create);
router.get('/languages/:id', languageController.find);
router.put('/languages/:id', languageController.update);
router.delete('/languages/:id', languageController.delete);

router.get('/developers', devController.getAll);
router.post('/developers', devController.create);
router.get('/developers/:id', devController.find);
router.put('/developers/:id', devController.update);
router.delete('/developers/:id', devController.delete);

module.exports = router;
