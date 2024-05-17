// student.server.model.js
// Load bcrypt module, used to hash the passwords
const bcrypt = require("bcrypt");
// Load the Mongoose module and Schema object
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define a new 'StudentSchema'
const studentSchema = new Schema({
  studentNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  favouriteActivities: {
    type: Array,
    required: false,
  },
});
// hash the passwords before saving
studentSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password.trim(), salt);
  this.password = hashedPassword;
});
//
// Create the 'Student' model out of the 'studentSchema'
module.exports = mongoose.model("Student", studentSchema);
