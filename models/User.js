const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  department: String,
  mobile: { type: String, required: true, unique: true },
  joiningDate: Date,
  email: { type: String, required: true, unique: true },
  gender: String,
  address: String,
  status: {
    type: String,
    enum: ["Active", "Inactive", "On Leave"],
    default: "Active"
  },
  isActive: {
    type: Boolean,
    default: true
  }
},{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);