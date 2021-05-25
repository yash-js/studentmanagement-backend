const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  name: {
    type: ObjectId,
    ref: "Student",
  },
  enrollmentNumber: String,
  marks: {
    type: Object,
  },
});

module.exports = Result = mongoose.model("Result", resultSchema);
