const DepartmentBudget = require("../models/DepartmentBudget");
const Department = require("../models/Department");
const asyncHandler = require("express-async-handler");

//create budget
exports.createDepartmentBudget = asyncHandler(async (req, res) => {
  try {

    let {
      departmentId,
      totalBudget,
      usedBudget,
      year,
      status,
      description
    } = req.body;

    status = status?.trim();
    description = description?.trim();

    // SIMPLE REQUIRED VALIDATION
    if (
      !departmentId ||
      totalBudget == null ||
      usedBudget == null ||
      !year ||
      !status ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // STATUS ENUM VALIDATION (prevent mongoose error)
    const validStatus = ["On Track", "Warning", "Critical"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    // Budget logic validation
    if (usedBudget > totalBudget) {
      return res.status(400).json({
        success: false,
        message: "Used budget cannot be greater than total budget"
      });
    }

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    const companyId = department.companyId;

    const remainingBudget = totalBudget - usedBudget;

    const budget = new DepartmentBudget({
      companyId,
      departmentId,
      totalBudget,
      usedBudget,
      remainingBudget,
      year,
      status,
      description
    });

    const savedBudget = await budget.save();

    res.status(201).json({
      success: true,
      message: "Department budget created successfully",
      data: savedBudget
    });

  } catch (error) {

    // HANDLE MONGOOSE VALIDATION ERROR
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* GET ALL BUDGETS */

exports.getDepartmentBudgets = asyncHandler(async (req, res) => {

  const budgets = await DepartmentBudget.find({ isActive: true })
    .populate("companyId", "companyName")
    .populate("departmentId", "departmentName")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: budgets
  });

});


/* GET SINGLE BUDGET */

exports.getDepartmentBudgetById = asyncHandler(async (req, res) => {

  const budget = await DepartmentBudget.findById(req.params.id)
    .populate("companyId", "companyName")
    .populate("departmentId", "departmentName");

  if (!budget) {
    return res.status(404).json({
      success: false,
      message: "Budget not found"
    });
  }

  res.status(200).json({
    success: true,
    data: budget
  });

});


/* UPDATE BUDGET */

exports.updateDepartmentBudget = asyncHandler(async (req, res) => {

  let { totalBudget, usedBudget, status, description } = req.body;

  // trim strings
  if (status) req.body.status = status.trim();
  if (description) req.body.description = description.trim();

  const budget = await DepartmentBudget.findById(req.params.id);

  if (!budget) {
    return res.status(404).json({
      success: false,
      message: "Budget not found"
    });
  }

  // validate numbers
  if (totalBudget != null && usedBudget != null) {

    if (usedBudget > totalBudget) {
      return res.status(400).json({
        success: false,
        message: "Used budget cannot be greater than total budget"
      });
    }

    req.body.remainingBudget = totalBudget - usedBudget;
  }

  const updatedBudget = await DepartmentBudget.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Budget updated successfully",
    data: updatedBudget
  });

});


/* DELETE BUDGET (SOFT DELETE) */

exports.deleteDepartmentBudget = asyncHandler(async (req, res) => {

  const budget = await DepartmentBudget.findById(req.params.id);

  if (!budget) {
    return res.status(404).json({
      success: false,
      message: "Budget not found"
    });
  }

  budget.isActive = false;

  await budget.save();

  res.status(200).json({
    success: true,
    message: "Budget deleted successfully"
  });

});