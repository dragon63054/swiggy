const express = require('express');
const pool = require('../db/client.cjs');
const router = express.Router();

router.get('/restaurant-list', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

module.exports = router;

