const mongoose = require("mongoose");

const DepartmentPerformanceSchema = new mongoose.Schema(
{
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },

  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  projectCompletion: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  employeeSatisfaction: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  year: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["Excellent", "Good", "Average", "Warning", "Critical"],
    required: true
  },

  comments: {
    type: String,
    trim: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("DepartmentPerformance", DepartmentPerformanceSchema);