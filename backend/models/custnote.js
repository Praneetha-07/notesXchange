const mongoose = require("mongoose");

const custnoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  subjectCode: {
    type: String,
    required: true,
  },

  semester: {
    type: String,
    required: true,
  },

  branch: {
    type: String,
    required: true,
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  noteType: {
    type: String,
    default: "text",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("custNote", custnoteSchema);
