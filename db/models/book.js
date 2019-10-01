const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: { 
        type: Sequelize.STRING, 
        validate: { 
            notEmpty: true,
            msg: '"Title" is required'
        } },
    author: {
        type: Sequelize.STRING, 
        validate: {
            notEmpty: true,
            msg: '"Author" is required'
        } },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, { sequelize });

  return Book;
};