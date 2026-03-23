const mongoose = require("mongoose");

const companyDetailsSchema = new mongoose.Schema({

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  workingHours: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },

  annualLeave: {
    type: Number,
    required: true,
    min: [0, "Annual leave cannot be negative"]
  }

}, { timestamps: true });

module.exports = mongoose.model("CompanyDetails", companyDetailsSchema);