const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObejctId } = mongoose.Schema;

const examSchema = new Schema({
  department: {
    type: String,
    required: true,
  },

  semester: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
  },
  time: {
    type: String,
  },
  date: {
    type: String,
  },
  year: {
    type: String,
  },
  hrs: {
    type: String,
  },
  subjectCode: String,
});

module.exports = Exam = mongoose.model("Exam", examSchema);
