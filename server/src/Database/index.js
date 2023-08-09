const mongoose = require('mongoose');

async function connectToDatabase(uri, options) {
  try {
    await mongoose.connect(uri, options);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }

  return mongoose.connection;
}

module.exports = {
  connectToDatabase,
};
