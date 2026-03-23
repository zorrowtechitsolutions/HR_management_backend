const express = require("express");
const router = express.Router();

const departmentBudgetController = require("../controllers/departmentbudget");

router.post("/",departmentBudgetController.createDepartmentBudget);

router.get("/",departmentBudgetController.getDepartmentBudgets);

router.get("/:id",departmentBudgetController.getDepartmentBudgetById);

router.put("/:id",departmentBudgetController.updateDepartmentBudget);

router.delete("/:id",departmentBudgetController.deleteDepartmentBudget);

module.exports = router;