const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");

const usersRoute = require('../Routes/User.route');
const productsRoute = require('../Routes/Product.route');
const chatgptRoute = require('../Routes/Chatgpt.route');
const toramaPayRoute = require('../Routes/Toramapay.route');

function initApp() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

app.use(express.json()); // important to parse JSON request bodies
app.use(bodyParser.json({ limit: '1MB' }));

app.use(bodyParser.urlencoded({
  limit: '1MB',
  extended: true,
  parameterLimit: 1000
}));
  
const allowedOrigins = ['http://localhost:8100', 'http://localhost:8101', 'https://fido.torama.ng'];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    // This will catch any 'entity too large' errors and respond with a custom error message
    res.status(413).json({ message: 'The request payload is too large!' });
  } else {
    // Pass the error on to the next middleware if it's not a '413' error
    next(err);
  }
});
  

  app.use('/api/users', usersRoute);
  app.use('/api/products', productsRoute);
  app.use('/api/chatgpt', chatgptRoute);
  app.use('/api/toramapay', toramaPayRoute);

  // other routes here

  return app;
}

module.exports = {
  initApp,
};
