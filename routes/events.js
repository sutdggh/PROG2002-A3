const express = require('express');
const router = express.Router();
const { getConnection } = require('../event_db');

// get gome events
router.get('/home', (req, res) => {
  const sql = `
    SELECT e.id, e.name, e.purpose, e.start_datetime, e.end_datetime, e.city, e.state, e.image_url, c.name AS category, o.name AS organization
    FROM events e
    JOIN event_categories c ON e.category_id = c.id
    JOIN organizations o ON e.org_id = o.id
    WHERE e.status = 'active'
    ORDER BY e.start_datetime ASC
  `;
  getConnection().query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// search events
router.get('/search', (req, res) => {
  // get query parameters
  const { date, location, category_id } = req.query;

  // default need status is active
  let conditions = ["e.status = 'active'"];
  let params = [];

  // other conditions
  if (date) {
    conditions.push("(DATE(e.start_datetime) <= ? AND (e.end_datetime IS NULL OR DATE(e.end_datetime) >= ?))");
    params.push(date, date);
  }
  if (location) {
    conditions.push("(e.city LIKE ? OR e.state LIKE ?)");
    params.push(`%${location}%`, `%${location}%`);
  }
  if (category_id) {
    conditions.push("e.category_id = ?");
    params.push(category_id);
  }

  const sql = `
    SELECT e.id, e.name, e.purpose, e.start_datetime, e.end_datetime, e.city, e.state, e.image_url, c.name AS category, o.name AS organization
    FROM events e
    JOIN event_categories c ON e.category_id = c.id
    JOIN organizations o ON e.org_id = o.id
    WHERE ${conditions.join(" AND ")}
    ORDER BY e.start_datetime ASC
  `;

  getConnection().query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const sql = `
    SELECT e.*, c.name AS category, o.name AS organization, o.mission, o.contact_email, o.phone
    FROM events e
    JOIN event_categories c ON e.category_id = c.id
    JOIN organizations o ON e.org_id = o.id
    WHERE e.id = ?
  `;
  getConnection().query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(results[0]);
  });
});

// get registrations for event
router.get('/:id/registrations', (req, res) => {
  const sql = `
    SELECT id, event_id, registrant_name, contact_email, contact_phone, tickets, notes, created_at
    FROM event_registrations
    WHERE event_id = ?
    ORDER BY created_at DESC
  `;
  getConnection().query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


module.exports = router;
