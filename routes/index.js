const express = require('express');
const router = express.Router();

const db = require('../db');
const { Book } = db.models;

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
        try {
        await cb(req, res, next)
        } catch(error){
            // res.status(500).send(error);
            res.status(500).render('error');
        }
    }
}

// Display all books
router.get('/books', asyncHandler( async (req, res) => {
    // Gets all the books 
    let book = await Book.findAll();
    // If book exits it will display all books, if it doesn't it displays page not found. 
    if (book) {
        res.render('index', { book })
    } else {
        res.render('page-not-found');
    }
}));

// Redirects to books page 
router.get('/', (req, res) => {
    res.redirect('/books' )
});

// Shows create new book page
router.get('/books/new', asyncHandler( async (req, res) => {
    res.render('new-book');
}));

// Post new book
router.post('/books/new', asyncHandler( async (req, res) => {
    let book;
    try {
        // creates new book
        book = await Book.create(req.body);
        res.redirect('/books/'+book.id); 
    } catch (error) {
        // Check if its a SequelizeValidationError
        if (error.name === "SequelizeValidationError") {
            // If error is caught it will be displayed in the form-error page
            let errors = error.errors.map(err => err.message);
            // book instance holds the values of the form
            book = await Book.build(req.body);
            res.render("new-book", { book, errors })

        } else {
            // This error will be caught in the catch block of asyncHandler
            throw error;
        }
    }
}));

// Displays the update book form
router.get('/books/:id', asyncHandler( async (req, res) => {
    // Finds the exact book 
    let book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('update-book', {book})
    } else {
        // Shows error page if the book does not exist
        res.render('error')
    }
}));

// Updates book
router.post('/books/:id', asyncHandler( async (req, res) => {
    let book;
    try {
        // Finds exact book and updates it
        book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect('/books');
        } else {
            res.render('error')
        }
    } catch (error) {
        // Check if its a SequelizeValidationError
        if(error.name === "SequelizeValidationError") {
            // If error is caught it will be displayed in the form-error page
            const errors = error.errors.map(err => err.message);
            book = await Book.build(req.body);
            // Updates the exact book
            book.id = req.params.id; 
            res.render("update-book", { book, errors })
        } else {
            throw error;
        }
    }
}));

router.get('/books/:id/delete', asyncHandler( async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('update-book', {book});
    } else {
        // res.sendStatus(404);
        res.render('page-not-found')
    }
}));

// Delete book
router.post('/books/:id/delete', asyncHandler( async (req, res) => {
    // Finds the book and deletes it if the book exists
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.redirect('/books');
    } else {
        // res.sendStatus(404);
        res.render('page-not-found')
    }
}));

// Shows page not found for routes other than the one that are mentioned
router.get('*', (req, res) => {
    res.render('page-not-found');
})


module.exports = router;