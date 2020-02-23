const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const ObjectId = mongoose.Schema.Types.ObjectId;

const authSchema = new mongoose.Schema(
  {
    _id: { type: ObjectId },
    name: { type: String },
    mobile: { type: Number, required: true },
    email: { type: String, required: true },
    managerType: { type: Number, required: true },
    status: { type: Boolean, default: true },
    password: { type: String }
  },
  { collection: "managers" }
);

/*-----------------------------------------------------
Incoming Requests Validations 
-----------------------------------------------------*/
function validateAuth(obj) {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .min(5)
      .label("Username"),
    password: Joi.string().required()
  });
  return Joi.validate(obj, schema);
}

exports.Auth = mongoose.model("Auth", authSchema);
exports.validate = validateAuth;
