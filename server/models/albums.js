const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumsSchema = new Schema({
  photoset: {
    id: String,
    primary: String,
    owner: String,
    ownername: String, 
    photo: [],
    page: Number,
    per_page: Number,
    perpage: Number,
    pages: Number,
    total: Number,
    title: String
  }
});

module.exports = mongoose.model('Albums', AlbumsSchema);