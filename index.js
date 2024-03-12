const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Create a new user
app.post('/api/users', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ error: 'Username is required.' });
  }

  const user = {
    username,
    _id: generateUserId(),
  };

  users.push(user);

  res.json(user);
});

// Create a new user
app.post('/api/users', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ error: 'Username is required.' });
  }

  const user = {
    username,
    _id: generateUserId(),
  };

  users.push(user);

  res.json({
    username: user.username,
    _id: user._id,
  });
});
// Get a list of all users
app.get('/api/users', (req, res) => {
  const userArray = users.map((user) => ({ username: user.username, _id: user._id }));
  res.json(userArray);
});


// Add exercises to a user
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  if (!description || !duration) {
    return res.json({ error: 'Description and duration are required.' });
  }

  const user = users.find((u) => u._id === _id);

  if (!user) {
    return res.json({ error: 'User not found.' });
  }

  const exercise = {
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
  };

  if (!user.log) {
    user.log = [];
  }

  user.log.push(exercise);

  // Send the updated user object in the response
  res.json({username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: new Date(exercise.date).toDateString(),
    _id: user._id,});
});

// Get full exercise log of a user
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = users.find((u) => u._id === _id);

  if (!user) {
    return res.json({ error: 'User not found.' });
  }

  let log = user.log || [];

  // Filter by date
  if (from || to) {
    log = log.filter((entry) => {
      const logDate = new Date(entry.date);
      return (!from || logDate >= new Date(from)) && (!to || logDate <= new Date(to));
    });
  }

  // Limit the number of logs
  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  const response = {
    username: user.username,
    _id: user._id,
    count: log.length,
    log,
  };

  res.json(response);
});

const generateUserId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
