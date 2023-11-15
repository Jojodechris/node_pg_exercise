/** BizTime express application. */


const express = require("express");
const slugify = require('slugify');


const app = express();
const ExpressError = require("./expressError")


// Parse request bodies for JSON
app.use(express.json());

const CompaniesRoutes = require("./routes/companies");
app.use("/companies", CompaniesRoutes);
const InvoicesRoutes=require("./routes/invoices");
app.use("/invoices", InvoicesRoutes);
const IndustriesRoutes= require("./routes/industries");
app.use("/industries",IndustriesRoutes)




/** 404 handler */ 

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


app.listen(3000, function () {
  console.log("Server started on 3000");
});

module.exports = app;
