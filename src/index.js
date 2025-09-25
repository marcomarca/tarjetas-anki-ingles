const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const Word = require('./models/Word');

// Gracefully handle unhandled promise rejections
// This is crucial for preventing crashes when the Google Cloud client
// fails to authenticate in the background.
process.on('unhandledRejection', (reason, promise) => {
    console.warn('[GLOBAL] Unhandled Promise Rejection at:', promise, 'reason:', reason.message);
    // Application specific logging, throwing an error, or other logic here
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


const wordRoutes = require('./routes/words');
const reviewRoutes = require('./routes/review');

// Routes
app.use('/words', wordRoutes);
app.use('/review', reviewRoutes);


// Sync database and start server
sequelize.sync({ force: false }) // Use { force: true } to drop and re-create tables
  .then(() => {
    console.log('Database & tables created!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });