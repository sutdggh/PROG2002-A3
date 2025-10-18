const express = require('express');
const router = express.Router();
const { getConnection } = require('../event_db');

// get registrations
router.get('/', (req, res) => {
  const sql = `
    SELECT r.id, r.event_id, r.registrant_name, r.contact_email, r.contact_phone,
           r.tickets, r.notes, r.created_at,
           e.name AS event_name
    FROM event_registrations r
    JOIN events e ON r.event_id = e.id
    ORDER BY r.created_at DESC
  `;
  getConnection().query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// delete registration
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM event_registrations WHERE id = ?';
  getConnection().query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Registration deleted.' });
  });
});


module.exports = router;
