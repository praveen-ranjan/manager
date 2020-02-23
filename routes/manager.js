/*
--------------------------------------------------
For Auth
Developer:- Praveen Ranjan
Date:- 25-jan-2020
--------------------------------------------------
*/
const express = require("express");
const router = express.Router();
const managerCtrl = require("../app/controllers/manager");
router.post("/login", managerCtrl.login);

router.post(
  "/changePassword",
  /*managerCtrl.protect,*/ managerCtrl.changePassword
);

router.post(
  "/forgotPassword",
  /*managerCtrl.protect,*/ managerCtrl.forgotPassword
);

router.post("/verifyOtp", managerCtrl.verifyOtp);

router.post("/resetPassword", managerCtrl.resetPassword);

module.exports = router;
