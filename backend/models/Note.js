const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    subjectCode: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true,
      uppercase: true,
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'EEE'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File is required'],
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    voteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Text index for search
noteSchema.index({ title: 'text', subject: 'text', subjectCode: 'text' });

module.exports = mongoose.model('Note', noteSchema);
