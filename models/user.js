const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  FirstName: { type: String, default: null },
  LastName: { type: String, default: null },
  Email: { type: String, unique: true },
  Password: { type: String },
  Token: { type: String },
});

module.exports = mongoose.model("user", userSchema);