const express = require("express");
const router = express.Router();
const multer = require("multer");
const ToramaPay = require("../Models/Toramapay.model"); 
const os = require("os");
const HOSTNAME = os.hostname();
const axios = require("axios");

// const multerConfig = require("../config/multer-config");
// const DIR = "/var/www/uploads/toramapay/";
// const upload = multerConfig(DIR);

// const checkAuth = require("../Middleware/Auth-middleware.js");

const generateAuthHeader = require('../Utils/mastercard-auth');


module.exports = {
  initiateCheckout: async (req, res, next) => {
    try {
      console.log( req.body, 'initiate-checkout');
      const authHeader = generateAuthHeader();
      console.log(authHeader, 'authHeader'); // works fine
    } catch (error) {
      console.log(error);
      res.status(500).json({message:'An error occurred ' + error});
      // next(error);
    }
  },
 
};


