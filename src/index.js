import 'dotenv/config';
import express from 'express';
import { matchRoute } from './routes/matches.js';
import http from 'http';
import { attachWebSocketServer } from './ws/server.js';
import { securityMiddleware } from './ws/arcjet.js';

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || process.env.Host || '0.0.0.0';

const app = express();
const server = http.createServer(app);

// Middleware to parse JSON request bodies
app.use(express.json());

// Root GET route returning a short message
app.get('/', (req, res) => {
  res.send('LiveSports server is running!');
});

//ACRJETS SECURITY LAYER - CALLED BEFORE PASSING THROUGH ANY FEATURE 
app.use(securityMiddleware());
//protecting all the matches route after here 

// Matches route starts with /matches/...
app.use('/matches', matchRoute);

const { broadcastMatchCreated }= attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

// Start the server and log the URL
server.listen(PORT, HOST, () => {
  const baseUrl =HOST === '0.0.0.0'?  `http://localhost:${PORT}`: `http://${HOST}:${PORT}`
  console.log(`Server is running at ${baseUrl}`);
  console.log(`websocket server is running at ${baseUrl.replace('http','ws')}/ws`);
});