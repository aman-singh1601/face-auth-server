const express = require('express');
const { handleRegister } = require('../controllers/registerControllers');

const router = express.Router();

router.post('/', handleRegister);


module.exports = router;