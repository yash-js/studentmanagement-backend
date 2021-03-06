const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  resetToken: { type: String, default: "" },
  expireToken: { type: Date, default: "" },
});

module.exports = Admin = mongoose.model("Admin", adminSchema);
