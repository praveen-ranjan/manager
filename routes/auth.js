/*
--------------------------------------------------
For Auth
Developer:- Praveen Ranjan
Date:- 25-jan-2020
--------------------------------------------------
*/
const express = require("express");
const router = express.Router();

const authCtrl = require("../app/controllers/auth");
router.post("/", authCtrl.auth);

module.exports = router;
