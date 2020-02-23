const axios = require("axios");
module.exports = {
  myFunction: function() {
    console.log("Custom function called...123");
  },

  sendSMS: async function(mobile, msg) {
    msg = encodeURI(msg);
    axios
      .get(
        process.env.SMS_PATH +
          "&to=" +
          mobile +
          "&sender=ROSEAT&message=" +
          msg +
          "&format=json"
      )
      .then(function(response) {
        console.log(response);
        console.log("Mobile is : ");
        console.log(mobile);
      })
      .catch(function(error) {
        //console.log(error);
      });
  },

  validateEmail: function(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  },

  mobileNumber: function(mobile) {
    var phoneno = /^\d{10}$/;
    if (mobile.match(phoneno)) {
      return true;
    } else {
      return false;
    }
  },

  randomSixDigit: function() {
    return Math.floor(100000 + Math.random() * 900000);
  }
};
