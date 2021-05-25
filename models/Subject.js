const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectScehma = new Schema({
  name: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
  },
  year: {
    type: String,
  },
  department: {
    type: String,
  },
  code: {
    type: String,
  },
});

module.exports = Subject = mongoose.model("Subject", subjectScehma);
