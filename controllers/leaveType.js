const asyncHandler = require("express-async-handler");
const LeaveType = require("../models/leaveType");


// CREATE LEAVE
exports.createLeaveType = asyncHandler(async (req, res) => {

    const {
        leaveName,
        leaveType,
        leaveUnit,
        status,
        notificationPeriod,
        duration,
        annualLimit
    } = req.body;

    // required fields
    if (!leaveName || !leaveType || !leaveUnit) {
        res.status(400);
        throw new Error("leaveName, leaveType and leaveUnit are required");
    }

    // status validation
    if (status && !["Active", "Inactive"].includes(status)) {
        res.status(400);
        throw new Error("Status must be Active or Inactive");
    }

    // notification period validation
    if (notificationPeriod && notificationPeriod.trim() === "") {
        res.status(400);
        throw new Error("Notification period cannot be empty");
    }

    // number validation
    if (duration && duration < 0) {
        res.status(400);
        throw new Error("Duration cannot be negative");
    }

    // notification period validation
    if (notificationPeriod !== undefined && notificationPeriod.trim() === "") {
        res.status(400);
        throw new Error("Notification period cannot be empty");
    }

    if (annualLimit && annualLimit < 0) {
        res.status(400);
        throw new Error("Annual limit cannot be negative");
    }

    const leave = await LeaveType.create(req.body);

    res.status(201).json({
        success: true,
        message: "Leave type created",
        data: leave
    });

});


// GET ALL LEAVES
exports.getLeaveTypes = asyncHandler(async (req, res) => {

    const leaves = await LeaveType.find().populate("companyId");

    res.status(200).json({
        success: true,
        count: leaves.length,
        data: leaves
    });

});


// UPDATE LEAVE
exports.updateLeaveType = asyncHandler(async (req, res) => {

    const leave = await LeaveType.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!leave) {
        res.status(404);
        throw new Error("Leave type not found");
    }

    res.status(200).json({
        success: true,
        message: "Leave type updated",
        data: leave
    });

});


// DELETE LEAVE
exports.deleteLeaveType = asyncHandler(async (req, res) => {

    const leave = await LeaveType.findByIdAndDelete(req.params.id);

    if (!leave) {
        res.status(404);
        throw new Error("Leave type not found");
    }

    res.status(200).json({
        success: true,
        message: "Leave type deleted"
    });

});