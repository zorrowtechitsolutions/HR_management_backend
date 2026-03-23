const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const CompanyPolicy = require("../models/companyDetails");


// CREATE COMPANY POLICY
exports.createCompanyPolicy = asyncHandler(async (req, res) => {

const { companyId, workingHours, annualLeave } = req.body;

// Required validation
if (!companyId || !workingHours?.startTime || !workingHours?.endTime || annualLeave === undefined) {
    res.status(400);
    throw new Error("companyId, working hours and annualLeave are required");
}

// ObjectId validation
if (!mongoose.Types.ObjectId.isValid(companyId)) {
    res.status(400);
    throw new Error("Invalid companyId");
}

// Annual leave validation
if (annualLeave < 0) {
    res.status(400);
    throw new Error("Annual leave cannot be negative");
}

// Prevent duplicate policy per company
const existing = await CompanyPolicy.findOne({ companyId });

if (existing) {
    res.status(400);
    throw new Error("Policy already exists for this company");
}

// Create policy
const policy = await CompanyPolicy.create({
    companyId,
    workingHours,
    annualLeave
});

// ✅ Populate company name (correct field)
const populatedPolicy = await CompanyPolicy.findById(policy._id)
.populate("companyId", "name email");

res.status(201).json({
    success: true,
    message: "Company policy created",
    data: populatedPolicy
});

});


// GET ALL POLICIES
exports.getCompanyPolicies = asyncHandler(async (req, res) => {

const policies = await CompanyPolicy.find()
.populate("companyId", "name email");

res.status(200).json({
    success: true,
    count: policies.length,
    data: policies
});

});


// GET SINGLE POLICY
exports.getCompanyPolicyById = asyncHandler(async (req, res) => {

if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid policy id");
}

const policy = await CompanyPolicy.findById(req.params.id)
.populate("companyId", "name email");

if (!policy) {
    res.status(404);
    throw new Error("Company policy not found");
}

res.status(200).json({
    success: true,
    data: policy
});

});


// UPDATE POLICY
exports.updateCompanyPolicy = asyncHandler(async (req, res) => {

if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid policy id");
}

const policy = await CompanyPolicy.findById(req.params.id);

if (!policy) {
    res.status(404);
    throw new Error("Company policy not found");
}

// Optional validation
if (req.body.annualLeave !== undefined && req.body.annualLeave < 0) {
    res.status(400);
    throw new Error("Annual leave cannot be negative");
}

const updatedPolicy = await CompanyPolicy.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
).populate("companyId", "name email");

res.status(200).json({
    success: true,
    message: "Company policy updated",
    data: updatedPolicy
});

});


// DELETE POLICY
exports.deleteCompanyPolicy = asyncHandler(async (req, res) => {

if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid policy id");
}

const policy = await CompanyPolicy.findById(req.params.id);

if (!policy) {
    res.status(404);
    throw new Error("Company policy not found");
}

await policy.deleteOne();

res.status(200).json({
    success: true,
    message: "Company policy deleted"
});

});