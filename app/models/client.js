const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const ObjectId = mongoose.Schema.Types.ObjectId;

const clientSchema = new mongoose.Schema(
  {
    _id: { type: ObjectId },
    client_name: { type: String },
    email_id: { type: String, required: true },
    client_id: { type: String, required: true },
    client_secret: { type: String, required: true },
    status: { type: Boolean, default: true }
  },
  { collection: "clients" }
);

/*-----------------------------------------------------
Incoming Requests Validations 
-----------------------------------------------------*/
function validateClient(obj) {
  const schema = Joi.object({
    client_id: Joi.string()
      .required()
      .label("Client ID"),
    client_secret: Joi.string()
      .required()
      .label("Client Secret")
  });
  return Joi.validate(obj, schema);
}

exports.Client = mongoose.model("Client", clientSchema);
exports.validate = validateClient;
