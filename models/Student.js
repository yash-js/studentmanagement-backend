const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: { type: String, required: true },
  semester: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
  },
  dob: {
    type: String,
  },
  username: {
    type: String,
  },
  contact: {
    type: Number,
  },
  role: {
    type: String,
    default: "student",
  },
  enrollmentNumber: String,
  resetToken: { type: String, default: "" },
  expireToken: { type: Date, defaule: "" },
});

module.exports = Student = mongoose.model("Student", studentSchema);
