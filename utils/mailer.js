const nodemailer = require("nodemailer");

module.exports = function(emailData) {
  let transporter = nodemailer.createTransport({
    host: "203.89.132.6",
    port: "587",
    secure: false, // true for 465, false for other ports
    auth: {
      user: "no_reply@checkinassistant.com", // generated ethereal user
      pass: "Hk#$52&sg" // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var attachments = emailData.emailAttachments;
  // setup email data with unicode symbols
  let mailOptions = {
    from: "<no_reply@checkinassistant.com>", // sender address
    to: emailData.emailTo, // list of receivers
    // cc: emailData.emailcc, // list of receivers
    //bcc: emailData.emailbcc, // list of receivers
    subject: emailData.emailSubject, // Subject line
    //text: 'Hello world?', // plain text body
    html: emailData.emailTemplate, // html body
    attachments: attachments
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
};
