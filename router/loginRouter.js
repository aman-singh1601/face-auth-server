const express = require('express');
const { handleLogin } = require('../controllers/loginControllers');

const router = express.Router();

router.post('/', handleLogin);


module.exports = router;
