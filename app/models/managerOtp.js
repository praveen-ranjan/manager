const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const ObjectId = mongoose.Schema.Types.ObjectId;

const otpSchema = new mongoose.Schema(
  {
    manager_id: { type: ObjectId },
    type: { type: String, required: true }, // mobile or email
    username: { type: String, required: true }, // mobile number or email address
    otp: { type: String },
    otpAt: { type: Number, default: new Date().getTime() },
    otpAtDate: { type: Date, default: new Date() },
    otpExpireAt: { type: Number, default: new Date().getTime() + 300000 },
    verified: { type: Boolean, default: false }
  },
  { collection: "managers_otp" }
);

otpSchema.statics.verifyOtp = function(otpDB, requestBody) {
  const { id, username, otp, type } = requestBody;
  if (
    otpDB.otp === otp &&
    otpDB.type === type &&
    otpDB._id == id &&
    otpDB.otpExpireAt > new Date().getTime() &&
    otpDB.username === username &&
    otpDB.verified === false
  ) {
    return true;
  } else {
    return false;
  }
};

/*-----------------------------------------------------
Incoming Requests Validations 
-----------------------------------------------------*/
exports.ManagerOtp = mongoose.model("ManagerOtp", otpSchema);
