/*
--------------------------------------------------
Developer:- Praveen Ranjan
Date:- 25-jan-2020
--------------------------------------------------
*/
const mongoSantize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const clientCtrl = require("../app/controllers/client"); /* First layer auth for client */
const managerCtrl = require("../app/controllers/manager"); /* Second layer auth for manager */
const AppError = require("../utils/appError");
const globalErrorHandler = require("../app/controllers/error");
const demoRoutes = require("../routes/demo");
const frontDeskRoutes = require("../routes/frontDesk");
const managerRoutes = require("../routes/manager");
const clientRoutes = require("../routes/client");

module.exports = function(app) {
  const bodyParser = require("body-parser");
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  /* First layer protection for every route, if fails show error message with 401 */
  app.use(mongoSantize());
  app.use(xss());
  // app.use(clientCtrl.protect);
  //app.use(managerCtrl.protect);

  // All the Routes come here...
  // app.use(apiVersion+'/city', cityRoutes);
  app.use("/v1/client", clientRoutes);
  app.use("/v1/manager", managerRoutes);
  app.use("/v1/demo", demoRoutes);
  app.use("/v1/frontDesk", frontDeskRoutes);

  // Default route 404 Error....
  app.use(function(req, res, next) {
    //res.status(404).send({ error: "End Point Not found..." });
    //const err = new Error("This end point not found.");
    //err.statusCode = 404;
    next(new AppError("This end point not found..", 404));
  });

  // Error handling middleware
  app.use(globalErrorHandler);
};
