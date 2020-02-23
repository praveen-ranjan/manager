/*
--------------------------------------------------
For front desk 
Developer:- Praveen Ranjan
Date:- 25-jan-2020
--------------------------------------------------
*/
const express = require("express");
const router = express.Router();

const frontDeskCtrl = require("../app/controllers/frontDesk");

router.get("/", frontDeskCtrl.list);

module.exports = router;
