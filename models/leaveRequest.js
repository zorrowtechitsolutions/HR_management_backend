const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  leaveType: {
    type: String,
    enum: ["Emergency", "Family", "Sick", "Casual"],
    required: true
  },

  leaveFrom: {
    type: Date,
    required: true
  },

  leaveTo: {
    type: Date,
    required: true
  },

  noOfDays: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },

  reason: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);