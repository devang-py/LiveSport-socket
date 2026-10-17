import express from 'express';
import { matchRoute } from './routes/matches.js';

const app = express();
const PORT = 8000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Root GET route returning a short message
app.get('/', (req, res) => {
  res.send('LiveSports server is running!');
});

// Matches route starts with /matches/...
app.use('/matches', matchRoute);

// Start the server and log the URL
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});