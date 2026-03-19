const express = require("express");
const router = express.Router();

const {
createLeaveType,
getLeaveTypes,
updateLeaveType,
deleteLeaveType
} = require("../controllers/leaveType");

router.post("/", createLeaveType);

router.get("/", getLeaveTypes);

router.put("/:id", updateLeaveType);

router.delete("/:id", deleteLeaveType);

module.exports = router;