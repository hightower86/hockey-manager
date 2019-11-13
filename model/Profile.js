const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  amplua: {
    type: String
  },
  team: {
    type: String
  },
  phoneNumber: {
    type: String,
    required: true
  }
});
