const jwt = require("jsonwebtoken");
const { Auth, validate } = require("../models/auth");
const bcrypt = require("bcrypt");

exports.auth = async function(req, res) {
  //await common.isJson(req, res);

  /* validation check */
  const { error } = validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({
      error: error.details[0].message,
      error_description: "Bad request"
    });
  }

  /* Getting user by email/phone */
  const user = await Auth.findOne({ email: req.body.username });
  /* If user not found */
  if (!user) {
    return res.status(400).json({
      error: "Invalid user",
      error_description: "Invalid username or password"
    });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  /* If password is incorrect  */
  if (!validPassword) {
    return res.status(400).json({
      error: "Invalid user",
      error_description: "Invalid username or password"
    });
  }

  //console.log(process.env.JWT_SIGNATURE);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SIGNATURE);

  return res.status(200).json({
    token: token
  });

  //validations end

  //   try {
  //     const partner = await Auth.findOne({
  //       client_id: req.body.client_id,
  //       client_secret: req.body.client_secret,
  //       status: true
  //     });

  //     //console.log(partner);

  //     if (partner) {
  //       const token = partner.generateAuthToken();
  //       return res.status(200).json({
  //         [config.get("jwtTokenPost")]: token
  //       });
  //     } else {
  //       return res.status(401).json({
  //         error: "Invalid client",
  //         error_description: "Bad client credentials"
  //       });
  //     }
  //   } catch (err) {
  //     return res.status(500).json({
  //       error: "Internal server error"
  //     });
  //   }
};
