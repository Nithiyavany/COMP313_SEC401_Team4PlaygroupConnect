//course.server.model.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

  courseName: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  courseCodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
});

const CourseModel = mongoose.model('Course', courseSchema);

module.exports = CourseModel;
