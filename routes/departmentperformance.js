const express = require("express");
const router = express.Router();

const performanceController = require("../controllers/departmentperformance");


router.post("/", performanceController.createPerformance);

router.get("/", performanceController.getPerformances);

router.get("/:id", performanceController.getPerformanceById);

router.put("/:id", performanceController.updatePerformance);

router.delete("/:id", performanceController.deletePerformance);


module.exports = router;