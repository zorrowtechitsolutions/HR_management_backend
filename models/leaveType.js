const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema(
{

      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
      },
    
    leaveName: {
        type: String,
        required: true
    },

    leaveType: {
        type: String,
        enum: ["Paid", "Unpaid"],
        required: true
    },

    leaveUnit: {
        type: String,
        enum: ["Days", "Hours"],
        required: true
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Inactive"
    },

    note: {
        type: String
    },

    duration: {
        type: Number,
        default: 0
    },

    createdBy: {
        type: String,
         enum: ["Manager", "HR Department"],
        default: "HR Department"
    },

    notificationPeriod: {
        type: String
    },

    annualLimit: {
        type: Number,
        default: 0
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("LeaveType", leaveTypeSchema);