const express = require("express");
const router = express.Router();

const {
createLeaveRequest,
getLeaveRequests,
getLeaveRequestById,
updateLeaveRequest,
deleteLeaveRequest
} = require("../controllers/leaveRequest");


// create leave
router.post("/", createLeaveRequest);

// get all leaves
router.get("/", getLeaveRequests);

// get single leave
router.get("/:id", getLeaveRequestById);

// update leave
router.put("/:id", updateLeaveRequest);

// delete leave
router.delete("/:id", deleteLeaveRequest);


module.exports = router;