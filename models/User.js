const mongoose = require('mongoose');
const validator = require('validator'); // check if email is valid or not
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide email'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

// ***** Mongoose Middleware *****
// Hash the password
UserSchema.pre('save', async function () {
  // this.modifiedPaths() return item  which we are modifying e.g  if we are changing email only it will return ['email'] and if we change both name and email then this will return ['email', 'name']

  // this.isModified('') returns true or false. if name is changed then  this.isModified('name') will return true otherwise it will return false

  // if we are not modifying the password then return don't apply the hash
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ***** Instance method *****
// Compare password when login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
