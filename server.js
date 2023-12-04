// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const usersFilePath = './user.json';
let users = [];
try {
  const data = fs.readFileSync(usersFilePath);
  users = JSON.parse(data);
} catch (err) {
  console.error('Error reading users.json file:', err);
}

app.post('/users', (req, res) => {
  const user = req.body;
  const lastId = users.length > 0 ? users[users.length - 1]._id : 0;
  const newId = lastId + 1;
  user._id = newId;
  users.push(user);
  updateUsersFile();
  res.json(user);
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u._id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  const index = users.findIndex(u => u._id === userId);
  if (index !== -1) {
    users[index] = updatedUser;
    updateUsersFile();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u._id === userId);
  if (index !== -1) {
    const deletedUser = users.splice(index, 1)[0];
    updateUsersFile();
    res.json(deletedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

function updateUsersFile() {
  fs.writeFile(usersFilePath, JSON.stringify(users), err => {
    if (err) {
      console.error('Error writing to users.json file:', err);
    } else {
      console.log('users.json file updated successfully');
    }
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
