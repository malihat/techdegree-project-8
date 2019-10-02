const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({extended: false}))

// uses the static file in public folder 
// app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, './public')));

// Use pug as template
app.set('view engine', 'pug');

// Create routes
const routes = require('./routes');
app.use(routes);

// Error handling middleware
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (err.status === 404) {
        res.render('page-not-found');
    } else if (err.status === 500) {
        res.render('error');
    }
    next();
 });


app.listen(3000);