const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const router = express.Router();
const multer = require ('multer');
const {randomNumber} = require('../helpers/libs');

const Book = require('../models/Book');
const User = require('../models/User');
//const Search = require('../models/Search');
const Comment = require('../models/Comment');

const {isAuthenticated} = require('../helpers/auth');



router.get('/books/add', isAuthenticated, (req, res) => 
{
	res.render('books/new-books.hbs');
});

router.post('/books/new-books', isAuthenticated, async (req, res) => 
{
	const imgUrl = randomNumber();
	const repetir = await Book.find({filename : imgUrl});
	if(repetir.length > 0)
	{
		imgUrl = randomNumber();
	}
	const imagebc = req.file.path;
	const ext = path.extname(req.file.originalname).toLowerCase();
	const targetPath = path.resolve(`public/uploads/${imgUrl}${ext}`);

	if(ext === '.png' || ext ==='.jpg' || ext === '.jpeg' || ext === '.gif')
	{
		//Rename mueve un archivo de un directorio a otro
		await fs.rename(imagebc, targetPath);
		const newBook = new Book({
			title : req.body.title,
			author : req.body.author, 
			description: req.body.description, 
			price: req.body.price, 
			store : req.body.store, 
			filename: imgUrl + ext
		})
		newBook.user = req.user.id;
		await newBook.save();
		//console.log(newBook);
	}
	else
	{
		await fs.unlink(imagebc);
        res.status(500).json({ error: 'Only Images are allowed' });
	}
	res.redirect('/books');

});

router.get('/books', isAuthenticated, async (req, res) => {
	const books = await Book.find().sort({date: 'desc'});
	//books.user = req.user.id;
	res.render('books/all-books', {books});
});

router.get('/search', isAuthenticated, async(req, res) =>{
	let searchOptions = {}

	//Con esto me aseguro que escriban algo y la busqueda sea sensible a mayusculas y minusculas
	if(req.query.author != null && req.query.author !== '')
	{
		searchOptions.author = RegExp(req.query.author, 'i')
	}
	if(req.query.title != null && req.query.title !== '')
	{
		searchOptions.title = RegExp(req.query.title, 'i')
	}
	try	//Aquí ya guardo en busquedas todas las coincidencias que encontraron
	{
		const busquedas = await Book.find(searchOptions).sort({date: 'desc'});
		res.render('books/search-books', { busquedas, searchOptions:req.query.author, searchOptions:req.query.title});
	}
	catch
	{
		req.flash('success_msg', 'Note Deleted successfuly');
	}

});

router.get('/books/:id/comment', isAuthenticated, async (req, res) => 
{
	const postcomment = await Book.findById(req.params.id);	//Paso el ID del book

	const comments = await Comment.find({post_id : postcomment._id});
	
	res.render('books/comment-books', {postcomment, comments});
});

router.post('/books/:id/comment', isAuthenticated, async (req, res) => {
	const post = await Book.findById(req.params.id);	//ID del book

	if(post)	//Sí el post existe crea el comentario
	{
		const newComment = new Comment(
		{
			comment : req.body.comment,
			postedBy: req.body.postedBy
		});

		newComment.post_id = post._id;
		await newComment.save();
		//console.log(newComment)

		res.redirect('/books/' + post._id + '/comment');
	}
});

router.get('/books/edit/:id',isAuthenticated, async (req, res) => {
	const book = await Book.findById(req.params.id);	//Paso el ID del book
	console.log(book);
	res.render('books/edit-books', {book});
});

router.put('/books/edit-books/:id', isAuthenticated, async (req,res) => 
{
	const {title, author, description, price, store, filename}= req.body;
	
	if(filename=="")
    	await Article.findByIdAndUpdate(req.params.id, { title, author, description, price, store, filename});

    else
    	await Article.findByIdAndUpdate(req.params.id, { title, author, description, price, store});
    req.flash('success_msg', 'Note Update successfuly');
	res.redirect('/books');
    
   
	
	
});

router.delete('/books/delete/:id', isAuthenticated, async (req, res) => {
	await Book.findByIdAndDelete(req.params.id);
	req.flash('success_msg', 'Note Deleted successfuly');
	res.redirect('/books');
});

router.delete('/books/deleteCom/:id', isAuthenticated, async (req, res) => 
{
	await Comment.findByIdAndDelete(req.params.id);

	req.flash('success_msg', 'Note Deleted successfuly');
	res.redirect('/books');
});

module.exports = router;