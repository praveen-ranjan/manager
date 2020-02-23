const jwt = require("jsonwebtoken");
const { Client, validate } = require("../models/client");
const bcrypt = require("bcrypt");
const AppError = require("../../utils/appError");

exports.auth = async function(req, res, next) {
  /* 1) validation check */
  const { error } = validate(req.body);
  if (error) {
    // return res.status(400).json({
    //   error: error.details[0].message,
    //   error_description: "Bad request"
    // });
    return next(new AppError(error.details[0].message, 400));
  }

  /* 2) Getting client by client Id*/
  const client = await Client.findOne({ client_id: req.body.client_id });

  /* 3) If user not found */
  if (!client) {
    return res.status(404).json({
      message: "Client does not exist"
      // error_description: "Invalid client or secret."
    });
  }

  const validSecret = await bcrypt.compare(
    req.body.client_secret,
    client.client_secret
  );
  /* 4) If password is incorrect  */
  if (!validSecret) {
    return res.status(404).json({
      message: "Client does not exist"
      //error_description: "Invalid client or secret."
    });
  }

  const clientToken = jwt.sign({ id: client._id }, process.env.JWT_SIGNATURE);

  return res.status(200).json({
    client_token: clientToken
  });
};

/*
Middleware for protecting routes
*/
exports.protect = async function(req, res, next) {
  /* checking for auth, avoid or not */
  if (avoidUrl(req.url)) {
    return next();
  }

  // 1) Getting token and check it is there or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMmVjZmNkM2JhYTFmMDNhYzk2NGM0MiIsImlhdCI6MTU4MDIyNjUyNn0.Q84BAnaAc5LIDZkq2KehuZYbb_si_M-ZOQP8gHNAsb8
  if (!token) {
    return next(new AppError("Client credentials required.", 401));
  }
  // 2) Verification token
  try {
    var decoded = jwt.verify(token, process.env.JWT_SIGNATURE);
  } catch (ex) {
    //console.log(ex);
    return res.status(400).json({
      message: "Invalid token."
    });
  }
  //req.client = decoded;

  // 3) Check if client still exists
  var client = await Client.findById(decoded.id);
  if (!client) {
    return next(new AppError("Client does not exist.", 400));
  }

  // 4) Here every thing is fine, so add client data in req object, so we can acces this any where
  req.client = decoded;

  next();
};

/* Will check the current url in url list, and if found ie we have to avoid auth */
function avoidUrl(_currentUrl) {
  /* all urls should be in lowercase */
  let avoidUrl = ["/v1/client"];
  let currentUrl = _currentUrl;
  currentUrl = currentUrl.toLowerCase();
  if (avoidUrl.includes(currentUrl)) {
    return true;
  }
  return false;
}
