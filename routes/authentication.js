const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');


router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/user/:id',userController.getUser);
module.exports = router;
