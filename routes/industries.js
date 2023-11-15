const express = require("express");
const slugify = require('slugify');
const router = new express.Router();
const db = require("../db")
const ExpressError = require("../expressError")

// listing all industries, which should show the company code(s) for that industry
router.get("/", async function(req, res, next) {
    try {
        const industriesQuery = await db.query(`
        SELECT 
          c.code AS company_code,
          i.industry,
          i.code
        FROM 
         industries i
          JOIN industries_companies ic ON i.code = ic.companies_code
          JOIN companies c ON ic.industries_code = i.code`);
          console.log(industriesQuery)

      return res.json({ industries:industriesQuery.rows});
    } catch(err){
      return next(err)
    }
  });


router.post("/", async function(req, res, next) {
    try {
      const {code,industry} = req.body;

      const result = await db.query(
           `INSERT INTO industries (code,industry) 
           VALUES ($1, $2) 
           RETURNING code,industry`,
        [code,industry]);
         return res.status(201).json({industry: result.rows[0]});  // 201 CREATED
    } catch (err) {
      return next(err);
    }
  });


  module.exports = router;