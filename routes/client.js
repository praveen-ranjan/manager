/*
--------------------------------------------------
For Client Auth
Developer:- Praveen Ranjan
Date:- 27-jan-2020
--------------------------------------------------
*/
const express = require("express");
const router = express.Router();

const clientCtrl = require("../app/controllers/client");
router.post("/", clientCtrl.auth);

module.exports = router;
