const http = require('http');
const dotenv = require('dotenv').config();
const { initApp } = require('./src/app');
const { initSocket } = require('./src/Socket');
const { connectToDatabase } = require('./src/Database');
const { databaseUri, serverPort } = require('./src/config');

async function startServer() {
  try {
    const app = initApp();
    const server = http.createServer(app);
    const db = await connectToDatabase(databaseUri);
    
    initSocket(server);

    server.listen(serverPort, () => {
      console.log(`Server is running on http://localhost:${serverPort}`);
    });

  } catch (error) {
    console.error('Error starting server', error);
  }
}

startServer();
