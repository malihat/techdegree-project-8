const express = require('express');
const router = express.Router();
// const Book = require('../db/models/book');

const db = require('../db');
const { Book } = db.models;

// Display all books
router.get('/books', async (req, res) => {
    let book = await Book.findAll();
    console.log(book)
    res.render('index', { book })
});

router.get('/', (req, res) => {
    res.redirect('/books' )
});

// Create new book
router.get('/books/new', async (req, res) => {
    res.render('new-book');
});

// Post new form
router.post('/books/new', async (req, res) => {
    const book = await Book.create(req.body)
    // console.log(req.body);
    // res.render('new-book' )
    res.redirect('/books/'+book.id);
});

router.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', {book})
});

// Update book
router.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect('/books/'+book.id);
});

// Delete book
router.get('/books/:id/delete', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('books/delete', {book});
});

router.post('/books/:id/delete', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.render('books');
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