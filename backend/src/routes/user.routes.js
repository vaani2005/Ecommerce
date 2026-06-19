const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const auth = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { deleteUser } = require("../controllers/user.controller");
const { getManagers, getCustomers } = require("../controllers/user.controller");

console.log("auth:", typeof auth);
console.log("authorize:", typeof authorize);
console.log("getManagers:", typeof getManagers);
console.log("getCustomers:", typeof getCustomers);

router.get("/managers", auth, authorize("admin"), getManagers);

router.get("/customers", auth, authorize("admin"), getCustomers);
router.delete("/:id", auth, authorize("admin"), deleteUser);
module.exports = router;
