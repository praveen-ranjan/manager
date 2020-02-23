const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require("bcrypt");

const managerSchema = new mongoose.Schema(
  {
    _id: { type: ObjectId },
    name: { type: String },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    managerType: { type: Number, required: true },
    hotelId: { type: ObjectId },
    status: { type: Boolean, default: true },
    password: { type: String }
  },
  { collection: "managers" }
);

/*This is static method. we can call it by Model name */
managerSchema.statics.passwordEncrypt = async function(password) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

/*This is static method. we can compare password here */
managerSchema.statics.comparePassword = async function(password, dbPassword) {
  const validPassword = await bcrypt.compare(password, dbPassword);
  return validPassword;
};

/*-----------------------------------------------------
Incoming Requests Validations 
-----------------------------------------------------*/
function validateManager(obj) {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .min(5)
      .label("Username"),
    password: Joi.string().required()
  });
  return Joi.validate(obj, schema);
}

function validateChangePassword(obj) {
  const schema = Joi.object({
    oldPassword: Joi.string()
      .required()
      .label("Old password"),
    newPassword: Joi.string()
      .required()
      .label("New password")
  });
  return Joi.validate(obj, schema);
}

function validateOtp(obj) {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .min(5)
      .label("Mobile or Email"),
    type: Joi.string()
      .required()
      .valid(["mobile", "email"])
      .label("Type"),
    otp: Joi.string()
      .required()
      .label("OTP"),
    id: Joi.ObjectId()
      .required()
      .label("ID")
      .error(() => {
        return {
          message: "ID is invalid"
        };
      })
  });
  return Joi.validate(obj, schema);
}

function validateResetPassword(obj) {
  const schema = Joi.object({
    password: Joi.string()
      .required()
      .min(5)
      .label("Password"),
    id: Joi.ObjectId()
      .required()
      .label("ID")
      .error(() => {
        return {
          message: "ID is invalid"
        };
      })
  });
  return Joi.validate(obj, schema);
}

exports.Manager = mongoose.model("Manager", managerSchema);
exports.validate = validateManager;
exports.validateChangePassword = validateChangePassword;
exports.validateOtp = validateOtp;
exports.validateResetPassword = validateResetPassword;
