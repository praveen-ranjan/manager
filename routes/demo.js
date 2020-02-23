const express = require("express");
const router = express.Router();
const clientCtrl = require("../app/controllers/client");

const demoCtrl = require("../app/controllers/demo");
router.get("/", demoCtrl.listing);

router.post("/add", demoCtrl.add);

router.get("/demo2", demoCtrl.list);

module.exports = router;
