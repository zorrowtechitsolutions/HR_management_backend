const mongoose = require("mongoose");

const departmentBudgetSchema = new mongoose.Schema(
{
  companyId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Company",
    required:true
  },

  departmentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Department",
    required:true
  },

  totalBudget:{
    type:Number,
    required:true
  },

  usedBudget:{
    type:Number,
    required:true
  },

  remainingBudget:{
    type:Number,
    required:true
  },

  year:{
    type:Number,
    required:true
  },

  status:{
    type:String,
    enum:["On Track","Warning","Critical"],
    default:"On Track"
  },

  description:{
    type:String,
    trim:true
  },

  isActive:{
    type:Boolean,
    default:true
  }

},
{timestamps:true}
);

module.exports = mongoose.model("DepartmentBudget",departmentBudgetSchema);