const asyncHandler = require("express-async-handler");
const LeaveRequest = require("../models/leaveRequest");
const LeaveBalance = require("../models/leaveBalance");
const CompanyPolicy = require("../models/companyDetails");

// CREATE LEAVE REQUEST
exports.createLeaveRequest = asyncHandler(async (req, res) => {

    const { userId, companyId,  leaveType, leaveFrom, leaveTo, noOfDays, reason } = req.body;

    if (!userId || !companyId || !leaveType || !leaveFrom || !leaveTo || !noOfDays) {
        res.status(400);
        throw new Error("All required fields must be provided");
    }

    const leave = await LeaveRequest.create(req.body);

    res.status(201).json({
        success: true,
        message: "Leave request created",
        data: leave
    });
});


// UPDATE LEAVE REQUEST (AUTO BALANCE)
exports.updateLeaveRequest = asyncHandler(async (req, res) => {
    

    const leave = await LeaveRequest.findById(req.params.id);
    

    if (!leave) {
        res.status(404);
        throw new Error("Leave request not found");
    }

    leave.status = req.body.status;
    leave.manageId = req.body.manageId;
    leave.manageRole = req.body.manageRole;

   await leave.save();
    

    const year = new Date(leave.leaveFrom).getFullYear();

    let balance = await LeaveBalance.findOne({
        userId: leave.userId,
        year: year
    });

    // CREATE IF NOT EXISTS
    if (!balance) {

        const companyPolicy = await CompanyPolicy.findOne({
            companyId: leave.companyId
        });

        if (!companyPolicy) {
            res.status(404);
            throw new Error("Company policy not found");
        }

        balance = new LeaveBalance({
            userId: leave.userId,
            companyId: leave.companyId,
            year: year,
            previousBalance: 0,
            currentBalance: companyPolicy.annualLeave,
            totalBalance: companyPolicy.annualLeave,
            usedLeave: 0,
            acceptedLeave: 0,
            rejectedLeave: 0,
            expiredLeave: 0,
            carryOverBalance: 0
        });
    }
    
    // APPROVED
    if (req.body.status === "Approved") {
    if (balance.currentBalance < leave.noOfDays) {
            res.status(400);
            throw new Error("Insufficient balance");
        }

        balance.currentBalance -= leave.noOfDays;
        balance.totalBalance -= leave.noOfDays;
        balance.usedLeave += leave.noOfDays;
        balance.acceptedLeave += leave.noOfDays;
    }

    // REJECTED
    if (req.body.status === "Rejected") {
        balance.rejectedLeave += leave.noOfDays;
    }

    await balance.save();

    const updatedLeave = await LeaveRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: "Leave updated",
        data: updatedLeave
    });
});