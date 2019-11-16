const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

// Middlware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users.js'));
app.use('/api/auth', require('./routes/api/auth.js'));
app.use('/api/profiles', require('./routes/api/profiles.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is runing on port ${PORT}`));
