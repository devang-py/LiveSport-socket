import express from 'express';

const app = express();
const PORT = 8000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Root GET route returning a short message
app.get('/', (req, res) => {
  res.send('LiveSports server is running!');
});

// Start the server and log the URL
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
