/** Routes about companies. */

const express = require("express");
const slugify = require('slugify');
const router = new express.Router();
const db = require("../db")
const ExpressError = require("../expressError")
/** GET / - returns `{cats: [cat, ...]}` */

router.get("/", async function(req, res, next) {
  try {
    const companiesQuery = await db.query("SELECT * FROM companies")
    return res.json({ companies: companiesQuery.rows});
  } catch(err){
    return next(err)
  }
});


/** GET /[id] - return data(code,name,description,industries) about one company : `{cat: cat}` */


// companies.js
router.get("/:code", async function(req, res, next) {
    try {
      // return data(code,name,description
      // const companiesQuery = await db.query(
      //   "SELECT * FROM companies WHERE code = $1", [req.params.code]);
        // return industry of that company 
        const companiesQuery = await db.query(`
        SELECT 
          c.code AS company_code,
          c.name AS company_name,
          c.description AS company_description,
          i.industry
        FROM 
          companies c
          JOIN industries_companies ic ON c.code = ic.companies_code
          JOIN industries i ON ic.industries_code = i.code
        WHERE 
          c.code = $1`, [req.params.code]);
  
      if (companiesQuery.rows.length === 0) {
        let notFoundError = new Error(`There is no company with code '${req.params.code}`);
        notFoundError.status = 404;
        throw notFoundError;
      }
      return res.json({ company: companiesQuery.rows[0] });
    } catch (err) {
      return next(err);
    }
  });

/** POST / - create cat from data; return `{cat: cat}` */

router.post("/", async function(req, res, next) {
    try {
      const {code,name,description} = req.body;

      const result = await db.query(
           `INSERT INTO compamies (code,name,description) 
           VALUES ($1, $2, $3) 
           RETURNING code, name,description`,
        [code,name,description]);
         
         return res.status(201).json({company: result.rows[0]});  // 201 CREATED
    } catch (err) {
      return next(err);
    }
  });
  
  
  /** PATCH /[id] - update fields in cat; return `{cat: cat}` */
  
  router.patch('/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
      const { name, description } = req.body;
      console.log(req.body)
      const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code])
      console.log(results)
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't update comapnies with code of ${code}`, 404)
      }
      return res.send({ company: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })
  
  
  /** DELETE /[id] - delete cat, return `{message: "Cat deleted"}` */
  
router.delete("/:code", async function(req, res, next) {
    try {
      const result = await db.query(
        "DELETE FROM companies WHERE code = $1 ", [req.params.code]);
        return res.json({ message: "company deleted" });
    } catch (err) {
      return next(err);
    }
  });
  
  
  module.exports = router;
  


  