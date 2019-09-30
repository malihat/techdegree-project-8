const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: { 
        type: Sequelize.STRING, 
        validate: { 
            notEmpty: true
        } },
    author: {
        type: Sequelize.STRING, 
        validate: {
            notEmpty: true
        } },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, { sequelize });

  return Book;
};