const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cors = require('cors');   
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/upload', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});