const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); // ✅ check this path!
const communityRoutes = require("./routes/communityRoutes"); // 👈 import

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

// ✅ Mount user routes
app.use('/api/users', userRoutes);
app.use("/api/community", communityRoutes); // 👈 use

app.get('/', (req, res) => {
  res.send('Tangle backend is running 🫶');
});

module.exports = app;
