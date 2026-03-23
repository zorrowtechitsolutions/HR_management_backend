const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const LeaveBalance = require("../models/leaveBalance");

// GET ALL
exports.getLeaveBalances = asyncHandler(async (req, res) => {
    const balances = await LeaveBalance.find()
        .populate("userId", "firstName lastName email")
        .populate("companyId", "name email");

    res.json({
        success: true,
        data: balances
    });
});

// GET ONE
exports.getLeaveBalanceById = asyncHandler(async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error("Invalid ID");
    }

    const balance = await LeaveBalance.findById(req.params.id);

    if (!balance) {
        res.status(404);
        throw new Error("Not found");
    }

    res.json({ success: true, data: balance });
});

// UPDATE
exports.updateLeaveBalance = asyncHandler(async (req, res) => {

    const balance = await LeaveBalance.findById(req.params.id);

    if (!balance) {
        res.status(404);
        throw new Error("Not found");
    }

    const updated = await LeaveBalance.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json({ success: true, data: updated });
});

// DELETE
exports.deleteLeaveBalance = asyncHandler(async (req, res) => {

    const balance = await LeaveBalance.findById(req.params.id);

    if (!balance) {
        res.status(404);
        throw new Error("Not found");
    }

    await balance.deleteOne();

    res.json({ success: true, message: "Deleted" });
});