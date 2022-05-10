const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
// const db = require('./db/db.json');
// const readWrite = require('./db/read-write');
const PORT = process.env.PORT || 3002;
// const uuid = require('./helpers/uuid');
const util = require('util');
const promiseReadFile = util.promisify(fs.readFile);
const promiseWriteFile = util.promisify(fs.writeFile);
var uniqid = require('uniqid'); 
console.log(uniqid()); // -> 4n5pxq24kpiob12og9

//handles the post request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//get the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

//function to read file
function readDb() {
  return promiseReadFile('./db/db.json', 'utf8').then(function (data) {
      console.log(data)
      return (JSON.parse(data))
  })
}
// function to write file. Array of objects to db.json
function writeDb() {
  return promiseWriteFile('./db.db.json').then(function (data) {
      console.log(data)
      return (JSON.parse(data))
  })
}

// adding in notes ?
app.get('/api/notes', (req, res) => {
  // readWrite.
  readDb().then(function (data) {
    res.json(data)
  })
});

// // POST request to add a note
app.post('/api/notes', (req, res) => {
  // readWrite.
  readDb().then(function (data) {
    const note = req.body;
    console.log('note', note)
    note.id = uniqid()
    console.log('updatedNote', note)
    data.push(note);
    console.log('db', data)
    fs.writeFile('./db/db.json', JSON.stringify(data), function () {
      res.json(data)
    })
  })
});

app.delete('/api/notes/:id', (req, res) => {
  // readWrite.
  readDb().then(function (data) {
    // const note = req.body;
    // data.push(note);
    console.log('flag', req.params.id),
    console.log('db', data)
    const newNote = data.filter(element => element.id !== req.params.id);
    console.log('here')
console.log('new flag', newNote)



    fs.writeFile('./db/db.json', JSON.stringify(newNote), function () {
      res.json(newNote)
    })
  })
});

// get the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
  console.log(`Note Taker App is running at http://localhost:${PORT} 🚀`)
);

// module.exports = {
//   readDb: readDb,
//   writeDb: writeDb
// }


