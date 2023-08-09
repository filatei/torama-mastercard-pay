const express = require('express');
const router = express.Router();

const ToramaController = require('../Controllers/Toramapay.controller');

//Post
router.post('/initiate-checkout', ToramaController.initiateCheckout);


module.exports = router;
