const mongoose = require("mongoose");
module.exports = function() {
  // admin:admin1234@
  //process.env.DB_CONNECTION  // local dtabase
  //  "mongodb+srv://praveen:Le4zlMSygRmjmFtV@cluster0-psbap.mongodb.net/jonas?retryWrites=true&w=majority",
  mongoose
    .connect(
      "mongodb+srv://praveen:Le4zlMSygRmjmFtV@cluster0-psbap.mongodb.net/jonas?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )

    .then(() => console.log("Connected to mongodb...[ Manager App ]"))
    .catch(err => console.error("Could not connect to mongodb...", err));

  mongoose.set("useFindAndModify", false);
  //(node:8156) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead. so we set globally false.
};
