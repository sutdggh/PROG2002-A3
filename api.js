const express = require('express');
const path = require('path');
const cors = require('cors');
const { getConnection } = require('./event_db');

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const eventsRouter = require('./routes/events');
const categoriesRouter = require('./routes/categories');
const organizationsRouter = require('./routes/organizations');
const registrationsRouter = require('./routes/registrations');

// Use routes
app.use('/api/events', eventsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/organizations', organizationsRouter);
app.use('/api/registrations', registrationsRouter);

// Use client
app.use(express.static(path.join(__dirname, 'client')));


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
