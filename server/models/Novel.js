const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
    enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Other']
  },
  author: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String, // URL to the image
    default: '/uploads/default-cover.jpg'
  },
  status: {
    type: String,
    required: true,
    enum: ['Plan to Read', 'Reading', 'Completed', 'Dropped', 'On Hold']
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  comments: {
    type: String,
    default: ''
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String
  }],
  totalChapters: {
    type: Number,
    default: 0
  },
  currentChapter: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Novel', novelSchema); 