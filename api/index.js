const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://madhusudhan262604_db_user:Madhusudhan26@cluster0.ffgyseu.mongodb.net/?appName=Cluster0';
  
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  logo: { type: String },
  position: { type: String, required: true },
  salary: { type: String, required: true },
  experience: { type: String, required: true },
  role: { type: String },
  location: { type: String, required: true },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ email: user.email }, 'your-jwt-secret-key', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    // Transform _id to id so frontend doesn't break
    const transformedJobs = jobs.map(job => ({
      ...job._doc,
      id: job._id.toString()
    }));
    res.status(200).json(transformedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
});

module.exports = app;
