const asyncHandler = require("express-async-handler");
const LeaveRequest = require("../models/leaveRequest");

// CREATE LEAVE REQUEST

exports.createLeaveRequest = asyncHandler(async (req, res) => {

const { name, leaveType, leaveFrom, leaveTo, noOfDays, status, reason } = req.body;

// Required fields
if (!name || !leaveType || !leaveFrom || !leaveTo || !noOfDays) {
    res.status(400);
    throw new Error("name, leaveType, leaveFrom, leaveTo and noOfDays are required");
}

// leaveType enum validation
const validLeaveTypes = ["Emergency", "Family", "Sick", "Casual"];
if (!validLeaveTypes.includes(leaveType)) {
    res.status(400);
    throw new Error("Invalid leaveType");
}

// status enum validation
if (status && !["Pending", "Approved", "Rejected"].includes(status)) {
    res.status(400);
    throw new Error("Status must be Pending, Approved or Rejected");
}

// date validation
if (new Date(leaveFrom) > new Date(leaveTo)) {
    res.status(400);
    throw new Error("leaveFrom cannot be greater than leaveTo");
}

// days validation
if (noOfDays <= 0) {
    res.status(400);
    throw new Error("noOfDays must be greater than 0");
}

// reason validation
if (!reason || reason.trim() === "") {
    res.status(400);
    throw new Error("Reason is required");
}

const leave = await LeaveRequest.create(req.body);

res.status(201).json({
success: true,
message: "Leave request created",
data: leave
});

});



// GET ALL LEAVE REQUESTS
exports.getLeaveRequests = asyncHandler(async (req, res) => {

const leaves = await LeaveRequest.find();

res.status(200).json({
success: true,
count: leaves.length,
data: leaves
});

});


// GET SINGLE LEAVE REQUEST
exports.getLeaveRequestById = asyncHandler(async (req, res) => {

const leave = await LeaveRequest.findById(req.params.id);

if(!leave){
res.status(404);
throw new Error("Leave request not found");
}

res.status(200).json({
success: true,
data: leave
});

});


// UPDATE LEAVE REQUEST
exports.updateLeaveRequest = asyncHandler(async (req, res) => {

const leave = await LeaveRequest.findById(req.params.id);

if(!leave){
res.status(404);
throw new Error("Leave request not found");
}


const updatedLeave = await LeaveRequest.findByIdAndUpdate(
req.params.id,
req.body,
{ new: true, runValidators: true }
);

res.status(200).json({
success: true,
message: "Leave request updated",
data: updatedLeave
});

});


// DELETE LEAVE REQUEST
exports.deleteLeaveRequest = asyncHandler(async (req, res) => {

const leave = await LeaveRequest.findById(req.params.id);

if(!leave){
res.status(404);
throw new Error("Leave request not found");
}

await leave.deleteOne();

res.status(200).json({
success: true,
message: "Leave request deleted"
});

});