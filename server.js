const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API running'));

//Define routes
app.use('/api/user', require('./routes/api/user'));
// app.use('/api/bus', require('./routes/api/bus'));
// app.use('/api/booking', require('./routes/api/booking'));
app.use('/api/admin', require('./routes/api/admin'));

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => console.log('Server started on port: ' + PORT));
