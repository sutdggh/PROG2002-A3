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

// get all events
router.get('/', (req, res) => {
  const sql = `
    SELECT e.*, c.name AS category, o.name AS organization
    FROM events e
    JOIN event_categories c ON e.category_id = c.id
    JOIN organizations o ON e.org_id = o.id
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

// add registrations for event
router.post('/:id/registrations', (req, res) => {
  const { registrant_name, contact_email, contact_phone, tickets, notes } = req.body;
  const eventId = req.params.id;

  // validate registrant_name, contact_email and tickets
  if (!registrant_name || !contact_email || !tickets) {
    return res.status(400).json({ error: 'Name, email, and tickets are required.' });
  }
  // validate tickets value
  if (tickets <= 0) {
    return res.status(400).json({ error: 'Tickets must be greater than 0.' });
  }

  const conn = getConnection();

  // Check for duplicate registrations (same event and same email)
  const checkSql = `
    SELECT id FROM event_registrations
    WHERE event_id = ? AND contact_email = ?
  `;
  conn.query(checkSql, [eventId, contact_email], (err, rows) => {
    if (err) {

    }
    if (rows.length > 0) {
      return res.status(400).json({ error: 'You have already registered for this event.' });
    }

    // insert new registration
    const insertSql = `
      INSERT INTO event_registrations
      (event_id, registrant_name, contact_email, contact_phone, tickets, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    conn.query(
      insertSql,
      [eventId, registrant_name, contact_email, contact_phone, tickets, notes || null],
      (err2) => {
        if (err2) {
          return res.status(500).json({ error: err2.message });
        }
        res.status(201).json({ message: 'Registration successful!' });
      }
    );
  });
});

// add event
router.post('/', (req, res) => {
  const b = req.body || {};
  const errors = [];

  // required fields
  if (!b.org_id) {
    errors.push('org_id is required.');
  }
  if (!b.category_id) {
    errors.push('category_id is required.');
  }
  if (!b.name) {
    errors.push('name is required.');
  }
  if (!b.start_datetime) {
    errors.push('start_datetime is required.');
  }

  // control input length
  if (b.name && String(b.name).length > 200) {
    errors.push('name too long (<=200).');
  }
  if (b.purpose && String(b.purpose).length > 255) {
    errors.push('purpose too long (<=255).');
  }
  if (b.image_url && String(b.image_url).length > 400) {
    errors.push('image_url too long (<=400).');
  }

  // number type should positive
  if (b.ticket_price_cents !== undefined && Number(b.ticket_price_cents) < 0) {
    errors.push('ticket_price_cents >= 0.');
  }
  if (b.capacity !== undefined && b.capacity !== null && Number(b.capacity) < 0) {
    errors.push('capacity >= 0 or null.');
  }
  if (b.goal_amount_cents !== undefined && b.goal_amount_cents !== null && Number(b.goal_amount_cents) < 0) {
    errors.push('goal_amount_cents >= 0 or null.');
  }

  // Latitude and Longitude Limit Range
  if (b.latitude !== undefined && b.latitude !== null) {
    const lat = Number(b.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) errors.push('latitude must be between -90 and 90.');
  }
  if (b.longitude !== undefined && b.longitude !== null) {
    const lng = Number(b.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) errors.push('longitude must be between -180 and 180.');
  }

  // Time sequence (end can be empty, but cannot be earlier than start)
  const start = b.start_datetime ? new Date(b.start_datetime) : null;
  const end = b.end_datetime ? new Date(b.end_datetime) : null;
  if (start && end && end < start) {
    errors.push('end_datetime must be >= start_datetime.');
  }

  // status default active
  const status = b.status || 'active';

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const sql = `
    INSERT INTO events (
      org_id, category_id, name, purpose, description, start_datetime, end_datetime, venue_name, address, city, state, 
      postcode, latitude, longitude, image_url, featured, ticket_price_cents, capacity, goal_amount_cents, status
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;
  const params = [
    b.org_id, b.category_id, b.name, b.purpose, b.description, b.start_datetime, b.end_datetime,
    b.venue_name, b.address, b.city, b.state, b.postcode, b.latitude, b.longitude, b.image_url, b.featured ? 1 : 0,
    b.ticket_price_cents || 0, b.capacity, b.goal_amount_cents, status
  ];

  getConnection().query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, message: 'Event created.' });
  });
});

// update event
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const b = req.body || {};
  const errors = [];

  // required fields
  if (!b.org_id) {
    errors.push('org_id is required.');
  }
  if (!b.category_id) {
    errors.push('category_id is required.');
  }
  if (!b.name) {
    errors.push('name is required.');
  }
  if (!b.start_datetime) {
    errors.push('start_datetime is required.');
  }

  // control input length
  if (b.name && String(b.name).length > 200) {
    errors.push('name too long (<=200).');
  }
  if (b.purpose && String(b.purpose).length > 255) {
    errors.push('purpose too long (<=255).');
  }
  if (b.image_url && String(b.image_url).length > 400) {
    errors.push('image_url too long (<=400).');
  }

  // number type should positive
  if (b.ticket_price_cents !== undefined && Number(b.ticket_price_cents) < 0) {
    errors.push('ticket_price_cents >= 0.');
  }
  if (b.capacity !== undefined && b.capacity !== null && Number(b.capacity) < 0) {
    errors.push('capacity >= 0 or null.');
  }
  if (b.goal_amount_cents !== undefined && b.goal_amount_cents !== null && Number(b.goal_amount_cents) < 0) {
    errors.push('goal_amount_cents >= 0 or null.');
  }

  // Latitude and Longitude Limit Range
  if (b.latitude !== undefined && b.latitude !== null) {
    const lat = Number(b.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) errors.push('latitude must be between -90 and 90.');
  }
  if (b.longitude !== undefined && b.longitude !== null) {
    const lng = Number(b.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) errors.push('longitude must be between -180 and 180.');
  }

  // Time sequence (end can be empty, but cannot be earlier than start)
  const start = b.start_datetime ? new Date(b.start_datetime) : null;
  const end = b.end_datetime ? new Date(b.end_datetime) : null;
  if (start && end && end < start) {
    errors.push('end_datetime must be >= start_datetime.');
  }

  // status default active
  const status = b.status || 'active';

  if (errors.length) {
    return res.status(400).json({ errors });
  }
  const sql = `
    UPDATE events SET
      org_id = ?, category_id = ?, name = ?, purpose = ?, description = ?, start_datetime = ?, end_datetime = ?,
      venue_name = ?, address = ?, city = ?, state = ?, postcode = ?, latitude = ?, longitude = ?, image_url = ?, featured = ?,
      ticket_price_cents = ?, capacity = ?, goal_amount_cents = ?, status = ?
    WHERE id = ?
  `;
  const params = [
    b.org_id, b.category_id, b.name, b.purpose, b.description, b.start_datetime, b.end_datetime,
    b.venue_name, b.address, b.city, b.state, b.postcode, b.latitude, b.longitude, b.image_url, b.featured ? 1 : 0,
    b.ticket_price_cents || 0, b.capacity, b.goal_amount_cents, status, id
  ];

  getConnection().query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Event updated.' });
  });
});

// delete event
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const conn = getConnection();

  const checkSql = 'SELECT COUNT(*) AS cnt FROM event_registrations WHERE event_id = ?';
  conn.query(checkSql, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // check count
    const cnt = rows?.[0]?.cnt || 0;
    if (cnt > 0) {
      return res.status(409).json({
        error: 'Cannot delete: registrations exist for this event.',
        registrations_count: cnt
      });
    }

    // delete sql
    const delSql = 'DELETE FROM events WHERE id = ?';
    conn.query(delSql, [id], (err2, result) => {
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }
      return res.json({ message: 'Event deleted.' });
    });
  });
});

module.exports = router;
