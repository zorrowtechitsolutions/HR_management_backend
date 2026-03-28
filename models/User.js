const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
{
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
  
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    trim: true
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },

  mobile: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "Employee"
  },

  department: String,
  designation: String,

  address: String,

  about: String,

  education: String,

  experience: String,

  skills: [
    {
      type: String
    }
  ],
  dateOfBirth: Date,

  joiningDate: Date,

  salary: Number,

  workLocation: {
    type: String,
    enum: ["Office", "Remote","Hybrid"]
  },

  status: {
    type: String,
    enum: ["On Duty","On Leave"],
    default: "On Duty"
  },

   totalProjects: {
    type: Number,
    default: 0
  },

  completedProjects: {
    type: Number,
    default: 0
  },

  rating: {
    type: Number,
    default: 0
  },

  // image: String,

  isActive: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);