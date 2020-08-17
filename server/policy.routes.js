const express = require('express')
const urlSlug = require('url-slug')
const {getIdFromSlug} = require("./slug.helpers");
const { query } = require('../db_config');

const router = express.Router();

router.get('/:slug', async (req, res) => {
  const {slug} = req.params
  const id = getIdFromSlug(slug)

  try {
    const data = await query(
      `SELECT
          tc.terms_and_conditions, tct.name
      FROM
          terms_conditions_type tct 
      JOIN
          terms_conditions tc 
              ON tct.id = tc.condition_type_id 
      WHERE
          tct.id = ${id}`
    )

    return res.status(200).json(data.length > 0 ? data[0] : null);
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
})

// It's for testing purpose
router.get('/slugpolicy', async (req, res) => {
  try {
    const data = await query(
      `SELECT
          id,
          name
      FROM
          terms_conditions_type
      WHERE
          softDel=0 AND status=1`
    )

    let slugified_data = []

    for (const {id, name} of data) {
      let slug_name = urlSlug(name)
      slug_name = `${slug_name}-${id}`
      slugified_data = [...slugified_data, {slug: slug_name}]
    }

    return res.status(200).json(slugified_data)
  } catch (e) {
    console.error(e)
    return res.status(500).send(e)
  }
})

module.exports = router;
