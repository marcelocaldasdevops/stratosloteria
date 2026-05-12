require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database/db');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Stratos Loteria API is running (LowDB Mode)' });
});

// Save a game
app.post('/api/games', (req, res) => {
  try {
    const { modality, numbers, meta } = req.body;
    const newGame = {
      id: uuidv4(),
      modality,
      numbers: Array.isArray(numbers) ? numbers : numbers.split(',').map(Number),
      meta,
      created_at: new Date().toISOString()
    };
    
    db.get('games')
      .push(newGame)
      .write();
      
    res.status(201).json({ id: newGame.id, message: 'Game saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// Get all games
app.get('/api/games', (req, res) => {
  try {
    const games = db.get('games')
      .orderBy(['created_at'], ['desc'])
      .value();
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Delete a game
app.delete('/api/games/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.get('games')
      .remove({ id })
      .write();
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
