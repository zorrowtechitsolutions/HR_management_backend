const express = require("express");
const router = express.Router();

const {
  getLeaveBalances,
  getLeaveBalanceById,
  updateLeaveBalance,
  deleteLeaveBalance
} = require("../controllers/leaveBalance");

router.get("/", getLeaveBalances);
router.get("/:id", getLeaveBalanceById);
router.put("/:id", updateLeaveBalance);
router.delete("/:id", deleteLeaveBalance);

module.exports = router;