const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

/* =======================
   SUPABASE CLIENT (server-side)
   Uses the service role key so it bypasses RLS for trusted
   server operations (job inserts/reads).
======================= */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* =======================
   GET /api/jobs
   Returns all jobs ordered by newest first.
======================= */
app.get('/api/jobs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching jobs:', error);
      return res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =======================
   POST /api/jobs
   Creates a new job listing.
======================= */
app.post('/api/jobs', async (req, res) => {
  try {
    const { company, logo, position, salary, experience, role, location } = req.body;

    if (!company || !position || !salary || !experience || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert([{ company, logo, position, salary, experience, role, location }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error inserting job:', error);
      return res.status(500).json({ message: 'Error creating job', error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = app;
