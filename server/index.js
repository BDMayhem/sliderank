require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Album = require('./models/albums');

const app = express();
const router = express.Router();

const port = process.env.PORT || 3001;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  next();
});

app.get('/api', (req, res) => res.json({ message: 'API initialized' }));

router.route('/albums')
  .get(function(req, res) {
    Album.find(function(err, albums) {
      if (err) res.send(err);
      res.json(albums);
    });
  })
  .post(function(req, res) {
    const album = new Album();
    album.photoset = req.body.photoset;

    album.save(function(err) {
      if (err) res.send(err);
      res.json({ message: 'album added' });
    });
  });

router.route('/albums/:album_id')
  .get(function(req, res) {
    Album.findById(req.params.album_id, function(err, album) {
      if(err || !album) res.send(err);
      res.json(album);
    });
  })
  .put(function(req, res) {
    Album.findByIdAndUpdate(req.params.album_id, req.body, function(err, album) {
      if(err || !album) res.send(err);
      res.json(album);
    });
  });

app.use('/api', router);

app.listen(port, () => console.log(`API running on port ${port}`));