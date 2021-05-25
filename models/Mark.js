const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marksSchema = new Schema({
  subjectCode: {
    type: String,
  },
  subject: {
    type: String,
  },

  name: {
    type: String,
  },
  enrollmentNumber: {
    type: String,
  },
  obtainedMarks: {
    type: String,
  },
  semester: String,
  department: String,
  totalMarks: {
    type: String,
  },
});

module.exports = Mark = mongoose.model("Mark", marksSchema);
