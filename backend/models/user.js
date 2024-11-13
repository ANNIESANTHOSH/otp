const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: Number, required: true }
});

module.exports = mongoose.model('User', userSchema);
