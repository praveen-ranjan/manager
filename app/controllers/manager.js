const jwt = require("jsonwebtoken");
const {
  Manager,
  validate,
  validateChangePassword,
  validateOtp,
  validateResetPassword
} = require("../models/manager");
const { ManagerOtp } = require("../models/managerOtp");
const bcrypt = require("bcrypt");
const AppError = require("../../utils/appError");
const helper = require("../../utils/helpers");
const mongoose = require("mongoose");

/*------------------------------------------------------------------------------------------
1. )Login
------------------------------------------------------------------------------------------*/
exports.login = async function(req, res, next) {
  /*
  Manager can login in two ways
  1. Mobile
  2. Email
     So we have to check both the cases and validation as well as
  */
  /* validation check */
  const { error } = validate(req.body);
  var username = "";
  var manager;
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  if (helper.validateEmail(req.body.username)) {
    username = "email";
  } else if (helper.mobileNumber(req.body.username)) {
    username = "mobile";
  } else {
    return next(new AppError("Username should be mobile or email", 400));
  }

  /* Getting user by email/phone */
  if (username == "email") {
    manager = await Manager.findOne({ email: req.body.username });
  } else if (username == "mobile") {
    manager = await Manager.findOne({ mobile: req.body.username });
  }
  /* If user not found */
  if (!manager) {
    return res.status(404).json({
      message: "User does not exist."
      //error_description: "Invalid username or password"
    });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    manager.password
  );
  /* If password is incorrect  */
  if (!validPassword) {
    return res.status(400).json({
      message: "Invalid user"
      // error_description: "Invalid username or password"
    });
  }

  //Here we are generating token and pass it as response. Values are
  // id
  // hotelId
  // managerType
  const token = jwt.sign(
    {
      id: manager._id,
      hotelId: manager.hotelId,
      managerType: manager.managerType
    },
    process.env.JWT_SIGNATURE_MANAGER
  );

  return res.status(200).json({
    manager_token: token
  });
};

/*------------------------------------------------------------------------------------------
2. )Middleware for protecting routes, For managers
------------------------------------------------------------------------------------------*/
exports.protect = async function(req, res, next) {
  /* checking for auth, avoid or not */
  if (avoidUrl(req.url)) {
    return next();
  }

  // 1) Getting manager token and check it is there or not
  let token;
  if (req.headers["x-manager-token"]) {
    token = req.headers["x-manager-token"];
  }

  if (!token) {
    return next(new AppError("Please login to get access.", 403));
  }
  // 2) Verification token
  try {
    var decoded = jwt.verify(token, process.env.JWT_SIGNATURE_MANAGER);
  } catch (ex) {
    //console.log(ex);
    return res.status(400).json({
      message: "Invalid token."
    });
  }
  //req.client = decoded;
  // 3) Check if manager still exists
  var manager = await Manager.findById(decoded.id);
  if (!manager) {
    return next(new AppError("Manager does not exist.", 404));
  }
  //4. ) Check manager status. It should be active. ie true
  if (manager.status === false) {
    return next(
      new AppError("Manager is in-active. Please contact admin.", 400)
    );
  }
  // 5) Here every thing is fine, so add manager data in req object, so we can acces this any where
  req.manager = decoded;
  next();
};

/*------------------------------------------------------------------------------------------
3. )Change Password 
------------------------------------------------------------------------------------------*/
exports.changePassword = async function(req, res, next) {
  //1. ) Check validation for required fields
  const { error } = validateChangePassword(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
      //description: "Bad request"
    });
  }
  let { oldPassword, newPassword } = req.body;
  let manager = await Manager.findById(req.manager.id);
  //2. ) Check manager exists or not, may be deleted in between
  if (!manager) {
    return next(new AppError("Manager does not exist.", 404));
  }
  //3. ) Check manager status. It should be active. ie true
  if (manager.status === false) {
    return next(
      new AppError("Manager is in-active. Please contact admin.", 400)
    );
  }
  //4. ) Check for old password with db password
  const validPassword = await Manager.comparePassword(
    oldPassword,
    manager.password
  );
  if (!validPassword) {
    return next(new AppError("Old password does not match.", 401));
  }
  //5. ) We are encrypting password here
  const hashed = await Manager.passwordEncrypt(newPassword);
  const changePasswordObj = {
    password: hashed
  };
  const changed = await Manager.findOneAndUpdate(
    { _id: req.manager.id },
    changePasswordObj,
    { new: true }
  );
  if (!changed) {
    return next(new AppError("Something went wrong", 500));
  }

  return res.status(200).json({
    message: "Password changed successfully"
    //data: hashed
  });
};

/*------------------------------------------------------------------------------------------
4. )Forgot Password 
    Here we send otp on mobile or email
------------------------------------------------------------------------------------------*/

exports.forgotPassword = async function(req, res, next) {
  let { username } = req.body;
  if (helper.validateEmail(req.body.username)) {
    username = "email";
  } else if (helper.mobileNumber(req.body.username)) {
    username = "mobile";
  } else {
    return next(new AppError("Username should be mobile or email", 400));
  }
  var manager = await Manager.findOne({ mobile: req.body.username });
  if (!manager) {
    return next(
      new AppError("Username with this mobile number does not exist", 404)
    );
  }

  const random = helper.randomSixDigit();
  const otpObject = new ManagerOtp({
    manager_id: manager._id,
    type: "mobile",
    username: manager.mobile,
    otp: random
  });
  _otp = await otpObject.save();
  if (username == "mobile") {
    let mobileNumber = "91" + req.body.username;
    await helper.sendSMS(mobileNumber, `${random} is your OTP.`);
  }

  return res.status(200).json({
    message: "OTP sent",
    data: {
      id: _otp._id,
      type: "mobile"
    }
  });
};

/*------------------------------------------------------------------------------------------
5. )Forgot Password verification with OTP
    Here App will send otp with id to verify 
    if otp is verified then manager can reset his password
    otp will expire after 5 minutes of generation
------------------------------------------------------------------------------------------*/

exports.verifyOtp = async function(req, res, next) {
  const { error } = validateOtp(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  const { id, username, otp, type } = req.body;
  const _otp = await ManagerOtp.findOne({
    _id: new mongoose.Types.ObjectId(id),
    otp: otp
  });
  if (!_otp) {
    return next(new AppError("Invalid OTP", 404));
  }

  if (ManagerOtp.verifyOtp(_otp, req.body)) {
    await ManagerOtp.findByIdAndUpdate(id, { verified: true });
    return res.status(200).json({
      message: "OTP verified",
      data: {
        status: true,
        id: id
      }
    });
  } else {
    return res.status(200).json({
      message: "OTP expired",
      data: {
        status: false
      }
    });
  }
};

/*------------------------------------------------------------------------------------------
6. )Forgot Password Reset
    1. get id(from verifyOtp api) and new password from client
    2. if record not found then give error 404
    3. hash the password using bcrypt
    4. update the password with new one (get manager id from _otp)
------------------------------------------------------------------------------------------*/

exports.resetPassword = async function(req, res, next) {
  const { error } = validateResetPassword(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  const { id, password } = req.body;
  const _otp = await ManagerOtp.findById(id);
  if (!_otp) {
    return next(new AppError("Record not found", 404));
  }
  const hashed = await Manager.passwordEncrypt(password);
  await Manager.findByIdAndUpdate(_otp.manager_id, { password: hashed });

  return res.status(200).json({
    message: "Password reset successfully",
    data: {
      status: true
    }
  });
};
/*------------------------------------------------------------------------------------------
7. )Avoid url function
------------------------------------------------------------------------------------------*/
function avoidUrl(_currentUrl) {
  /* all urls should be in lowercase */
  let avoidUrl = [
    "/v1/client",
    "/v1/manager/forgotpassword",
    "/v1/manager/login",
    "/v1/manager/resetpassword"
  ];
  let currentUrl = _currentUrl;
  currentUrl = currentUrl.toLowerCase();
  if (avoidUrl.includes(currentUrl)) {
    return true;
  }
  return false;
}
