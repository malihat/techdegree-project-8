const Sequelize = require('sequelize');

// Configures the Sequelize instance and loads the Book model 
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db',
  logging: false
});

// db object has Sequelize and database configurations
const db = {
  sequelize,
  Sequelize,
  models: {},
};

db.models.Book = require('./models/book.js')(sequelize);

module.exports = db;