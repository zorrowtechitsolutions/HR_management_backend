const express = require("express");
const router = express.Router();

const {
createCompanyPolicy,
getCompanyPolicies,
getCompanyPolicyById,
updateCompanyPolicy,
deleteCompanyPolicy
} = require("../controllers/companyDetails");

router.post("/", createCompanyPolicy);
router.get("/", getCompanyPolicies);
router.get("/:id", getCompanyPolicyById);
router.put("/:id", updateCompanyPolicy);
router.delete("/:id", deleteCompanyPolicy);

module.exports = router;