const sequelize = require('./database');
require('./models/Word'); // Important to import the model so sequelize is aware of it

console.log('Synchronizing database...');

sequelize.sync({ force: false }) // Use { force: true } to drop and re-create tables
  .then(() => {
    console.log('Database & tables created successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Unable to sync the database:', err);
    process.exit(1);
  });