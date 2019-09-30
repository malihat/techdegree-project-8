// const Sequlize = require('sequelize');

// const sequelize = new Sequlize({
//     dialect: 'sqlite',
//     storage: 'library.db'
// });

// class Book extends Sequlize.Model {}
// Book.init({
//     title: Sequlize.STRING,
//     author: Sequlize.STRING,
//     genre: Sequlize.STRING,
//     year: Sequlize.INTEGER
// }, { sequelize });

const db = require('./db');
const { Book } = db.models;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({extended: false}))

// uses the static file in public folder 
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, './public')));

// app.use('/static', express.static("public"));
app.set('view engine', 'pug');


const routes = require('./routes');
app.use(routes);

// When page doesn't exist
app.use( (req, res, next) => {
    const error = new Error('404 Page not found');
    error.status = 404;
    next(error);
})

app.use( (err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('page-not-found');
});


// ( async () => {
//     await sequelize.sync({force: true});

//     try {
//         // test the connection
//         // await sequelize.authenticate();
//         // console.log('Connection to the database successful!');

//         // Instance of the Movie class represents a database row
//         const movieInstances = await Promise.all([
//             Book.create({
//               title: 'To Kill a Mockingbird',
//               author: 'Harper Lee',
//               genre: 'Racism',
//               year: 1960
//             })
//           ]);
//         const moviesJSON = movieInstances.map(movie => movie.toJSON());
//         console.log(moviesJSON);
//     } catch (error) {
//         console.error('Error connecting to the database: ', error);
//     }
// })();

app.listen(3000);