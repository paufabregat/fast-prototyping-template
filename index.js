const express = require('express');
const db = require('sqlite');
const Promise = require('bluebird');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'build')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/posts', async (req, res, next) => {
  try {
    const posts = await db.all('SELECT * FROM Post LIMIT 10'); // <=
    res.send(posts);
  } catch (err) {
    next(err);
  }
});

app.get('*', (req,res) => {
 res.sendFile(path.join(__dirname, 'build/index.html'));
});

// On app start
Promise.resolve()
  // First, try to open the database
  .then(() => db.open('./database.sqlite', { Promise }))      // <=
  // Update db schema to the latest version using SQL-based migrations
  .then(() => db.migrate({ force: 'last' }))                  // <=
  // Display error message if something went wrong
  .catch((err) => console.error(err.stack))
  // Finally, launch the Node.js app
.finally(() => app.listen(port));
