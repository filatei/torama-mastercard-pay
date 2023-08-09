module.exports = {
    databaseUri: process.env.MONGODB_URI,
    serverPort: process.env.PORT || 3400,

    mongooseConfig: { useNewUrlParser: true, useUnifiedTopology: true }, // Add Mongoose configuration as needed
};
  