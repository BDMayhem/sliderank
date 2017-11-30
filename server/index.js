require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Album = require('./models/albums');
const path = require('path');
const axios = require('axios');

const app = express();
const router = express.Router();

const port = process.env.PORT || 5000;

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

app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.get('/api', (req, res) => res.json({ message: 'API initialized' }));

router.route('/albums')
  .get(function(req, res) {
    Album.find(function(err, albums) {
      if (err) res.send(err);
      res.json(albums);
    });
  })

  .post(function (req, res) {
    //check if submitted URL has user name or id
    const url = `https://api.flickr.com/services/rest/?method=flickr.urls.lookupUser&api_key=${process.env.REACT_APP_FLICKR_KEY}&url=${req.body.url}&format=json&nojsoncallback=1`;
    axios.get(url)
      .then(nameRes => {
        let checkedOwner = nameRes.data.user.id;
        return axios.get(`https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${process.env.REACT_APP_FLICKR_KEY}&photoset_id=${req.body.photoset}&user_id=${checkedOwner}&format=json&nojsoncallback=1`);
      })
      .then(setRes => {
        if (setRes.data.stat === 'ok'){
          setRes.data.photoset.photo.forEach((photo) => {
            photo.score = 0;
            photo.votes = 0;
            delete photo.isfamily;
            delete photo.isfriend;
            delete photo.ispublic;
            delete photo.isprimary;
          });

          setRes.data.photoset.topPhoto = `https://farm${setRes.data.photoset.photo[0].farm}.staticflickr.com/${setRes.data.photoset.photo[0].server}/${setRes.data.photoset.photo[0].id}_${setRes.data.photoset.photo[0].secret}.jpg`;

          delete setRes.data.photoset.page;
          delete setRes.data.photoset.per_page;
          delete setRes.data.photoset.perpage;
          delete setRes.data.photoset.pages;
          delete setRes.data.photoset.primary;

          const album = new Album();
          album.photoset = setRes.data.photoset;
          
          album.save(function(err) {
            console.log('saved')
            if (err) res.send(err);
            res.json({ message: 'album added' });
          });
        } else {
            console.log('not a valid flickr album url', setRes.data);
        }
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

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(port, () => console.log(`API running on port ${port}`));