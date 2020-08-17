const express = require('express');
const { query } = require('../db_config');
const router = express.Router();

router.get('/productIds', async (req, res) => {
  try {
    const productIds = await query(
      `SELECT
          id 
      FROM
          products 
      WHERE
          isApprove = 'authorize' 
          AND status = 'active' 
          AND softDelete = 0`
    )

    return res.status(200).json(productIds)
  } catch (e) {
    console.error(e)
    return res.status(500).send(e)
  }
})

router.get('/categoryIds', async (req, res) => {
  try {
    const categoryIds = await query(
      `SELECT
          id
      FROM
          category
      WHERE
          status = 'active'
          AND softDel = 0`
    )

    return res.status(200).json(categoryIds)
  } catch (e) {
    console.error(e)
    return res.status(500).send(e)
  }
})

router.get('/vendorIds', async (req, res) => {
  try {
    const vendorIds = await query(
      `SELECT
          id
      FROM
          category
      WHERE
          status = 'active'
          AND softDel = 0`
    )

    return res.status(200).json(vendorIds)
  } catch (e) {
    console.error(e)
    return res.status(500).send(e)
  }
})

module.exports = router;
