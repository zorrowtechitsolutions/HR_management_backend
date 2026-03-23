const mongoose = require("mongoose");

const leaveBalanceSchema = new mongoose.Schema({
      
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
      },
    

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  year:{
    type:Number,
    required:true
  },

  previousBalance: {
    type: Number,
    default: 0,
    min: 0
  },

  currentBalance: {
    type: Number,
    default: 0,
    min: 0
  },

  totalBalance: {
    type: Number,
    default: 0,
    min: 0
  },

  usedLeave: {
    type: Number,
    default: 0,
    min: 0
  },

  acceptedLeave: {
    type: Number,
    default: 0,
    min: 0
  },

  rejectedLeave: {
    type: Number,
    default: 0,
    min: 0
  },

  expiredLeave: {
    type: Number,
    default: 0,
    min: 0
  },

  carryOverBalance: {
    type: Number,
    default: 0,
    min: 0
  }

}, { timestamps:  true});

// ✅ Compound unique index
leaveBalanceSchema.index({ userId: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("LeaveBalance", leaveBalanceSchema);