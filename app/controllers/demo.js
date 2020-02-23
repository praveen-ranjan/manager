const helpers = require("../../utils/helpers");
const { Demo } = require("../models/demo");
exports.listing = async function(req, res, next) {
  return res.status(200).json({
    message: "Demo1 Page..."
    //res: i
  });
};

exports.add = async function(req, res, next) {
  var obj = await Demo.create({
    name: "ANishka Ranjan",
    email_id: "anishka.ranjan@birdapps.in"
  });

  return res.status(200).json({
    message: "Added Page...",
    data: obj
    //sum: s
    //res: i
  });
};
exports.list = async function(req, res, next) {
  // const err = new Error("Error");
  // err.statusCode = 500;
  // return next(err);
  //helpers.myFunction();

  //console.log(abc);

  //await helpers.sendSMS("91 9310210039", "Hi Praveen");

  return res.status(200).json({
    message: "Demo2 Page..."
    //sum: s
    //res: i
  });
};
