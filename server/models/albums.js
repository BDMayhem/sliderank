const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumsSchema = new Schema({
  photoset: {
    id: String,
    owner: String,
    ownername: String, 
    photo: [{
      votes: Number,
      score: Number,
      title: String,
      farm: Number,
      server: String,
      id: String
    }],
    title: String,
    topPhoto: String
  }
});

module.exports = mongoose.model('Albums', AlbumsSchema);