import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 45,
    required: true,
  },

  description: {
    type: String,
    maxlength: 700,
    required: true,
  },

  publishDate: {
    type: Number,
    required: true,
  },

  imageFileName: {
    type: String,
    maxlength: 100,
  },

  pdfFileName: {
    type: String,
    maxlength: 100,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model('Post', PostSchema);
