const mongoose = require('mongoose')
const { Schema } = mongoose;
const UserSchema = new Schema({
   name: {
      type: String,
      required: [true, 'Name is Required']
   },
   email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true
   },
   password: {
      type: String,
      required: [true, 'Password is Required']
   },
   date: {
      type: Date,
      default: Date.now
   }
});
const User = mongoose.model('user', UserSchema)
module.exports = User