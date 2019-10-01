const express = require('express');
const router = express.Router();
// const Book = require('../db/models/book');

const db = require('../db');
const { Book } = db.models;

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        res.status(500).send(error);
      }
    }
  }

// Display all books
router.get('/books', asyncHandler( async (req, res) => {
    let book = await Book.findAll();
    // console.log(book)
    if (book) {
        res.render('index', { book })
    } else {
        // res.sendStatus(404);
        res.render('page-not-found');
    }
}));

router.get('/', (req, res) => {
    res.redirect('/books' )
});

// Create new book
router.get('/books/new', asyncHandler( async (req, res) => {
    res.render('new-book');
}));

// Post new book
router.post('/books/new', asyncHandler( async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/books/'+book.id); //redirect it to books
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map(err => err.message);
            // console.error('Validation errors: ', errors);

            book = await Book.build(req.body);
            res.render("form-error", { book, errors })

        } else {
            throw error;
        }
    }
    
}));

router.get('/books/:id', asyncHandler( async (req, res) => {
    let book = await Book.findByPk(req.params.id);
    if (book) {
        // if (book.includes(req.params.id)) {
        //     console.log(book)
        //     res.render('update-book', {book, title: 'Update Book'})
        // } else {
        //     res.render('error');
        // }
        res.render('update-book', {book, title: 'Update Book'})
    } else {
        // res.sendStatus(404);
        // res.render("page-not-found")
        res.render('error')
    }
}));

// Update book
router.post('/books/:id', asyncHandler( async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            // res.redirect('/books/'+book.id)
            res.redirect('/books');
            // res.render('update-book', {book, title: 'Detail Form'} )
        } else {
            // res.sendStatus(404);
            // res.render('page-not-found')
            res.render('error')
        }
    } catch (error) {
        if(error.name === "SequelizeValidationError") {
            const errors = error.errors.map(err => err.message);
            console.error('Validation ERRORS: ', errors);

            book = await Book.build(req.body);
            book.id = req.params.id; // make sure correct article gets updated
            res.render("form-error", { book, errors })
        } else {
            throw error;
        }
    }
}));

// Delete book
router.get('/books/:id/delete', asyncHandler( async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('update-book', {book});
    } else {
        // res.sendStatus(404);
        res.render('page-not-found')
    }
}));

router.post('/books/:id/delete', asyncHandler( async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.redirect('/books');
    } else {
        // res.sendStatus(404);
        res.render('page-not-found')
    }
}));

router.get('*', (req, res) => {
    res.render('page-not-found');
})







// router.get('/books/:id', (req, res) => {
//     let id = req.params.id;
//     // if id does not exist, then 
//     const err = new Error('This project is unavailable');
//     res.status(404);
//     res.render('error');
// // else 
//     res.render('update-book');
// });

module.exports = router;