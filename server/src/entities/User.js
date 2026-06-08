import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    maxlength: 45,
    required: true,
  },

  login: {
    type: String,
    maxlength: 12,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    maxlength: 45,
    required: true,
  },

  gender: {
    type: String,
    enum: ['m', 'f'],
    required: true,
  },

  role: {
    type: String,
    enum: ['p', 'r'],
    required: true,
  },
});

export default mongoose.model('User', UserSchema);
