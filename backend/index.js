const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const cors = require('cors');   
require('dotenv').config();

const app = express();
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:8081", // Expo web
      "exp://192.168.43.123:8081", // Expo Go app URL
      "http://192.168.43.123:8081" // Local network IP address
    ],
    credentials: true, // Allow cookies and headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/checklist', checklistRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});