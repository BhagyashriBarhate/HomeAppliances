const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true
  },  
  address: {
    type: String,
    required: true
  },  
  date: {
    type: Date,
    default: Date.now
  }
});


const User = mongoose.model('admin', UserSchema);

module.exports = User;



