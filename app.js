require("express-async-errors");
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
dotenv.config({ path: "./config.env" });
const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Customer API",
      version: "1.0.0",
      description: "Customer API Information",
      contact: {
        name: "Praveen Ranjan"
      },
      servers: "localhost:3009"
    }
  },
  apis: ["app.js"]
};

var options = {
  explorer: true
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

/**
 * @swagger
 * /customer:
 *  get:
 *   tags:
 *      - Customers
 *   description: use to request all customers
 *   responses:
 *      '200':
 *       description: A successful response
 *      '400':
 *       description: Validation error
 *      '401':
 *       description: Client credential error
 */
app.get("/customer", (req, res) => {
  //res.send("Customer...");
  return res.status(200).json({
    name: "Praveen Ranjan",
    city: "Delhi"

    //res: i
  });
});

/**
 * @swagger
 * /customerName/{id}:
 *  get:
 *   tags:
 *      - Customers
 *   description: use to request all customers
 *   parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: query
 *         required: true
 *         type: string
 *   responses:
 *      '200':
 *       description: A successful response
 *
 */
app.get("/customerName", (req, res) => {
  res.send("Praveen...");
});

// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger.json");

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// const nodemailer = require("./utils/mailer");

// set http headers security
app.use(helmet());

console.log(process.env.NODE_ENV);

require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

// nodemailer({
//   emailTo: "praveen.ranjan@birdapps.in",
//   emailSubject: "Greetings",
//   emailTemplate: "<b>Hello Praveen</b>"
// });

//const bcrypt = require("bcrypt");
// async function run() {
//   const salt = await bcrypt.genSalt(10);
//   console.log(salt);
//   const hashed = await bcrypt.hash("admin", salt);
//   console.log(hashed);
// }
// run();
