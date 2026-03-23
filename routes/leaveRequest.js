const express = require("express");
const router = express.Router();

const {
    createLeaveRequest,
    updateLeaveRequest
} = require("../controllers/leaveRequest");

router.post("/", createLeaveRequest);
router.put("/:id", updateLeaveRequest);

module.exports = router;