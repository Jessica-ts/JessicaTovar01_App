const express = require('express');
const router = express.Router();

const User = require('../models/User');
const {isAuthenticated} = require('../helpers/auth');

const passport = require('passport');
const Book = require('../models/Book');

router.get('/', (req, res, next) => {
	res.render('index');
});

router.get('/about', isAuthenticated, (req, res) => {
	res.render('about');
});

router.get('/users/signin', (req, res) => {
	res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
	successRedirect: '/profile',
	failureRedirect: '/users/signin',
	failureFlash: true
}));

router.get('/users/signup', (req, res) => {
	res.render('users/signup');
});

//Ruta para signUp
router.post('/users/signup', async (req, res) => {
	const {name, email, password, confirm_password} = req.body;
	const errors = [];
	if((name.length <= 0) || (email.length <= 0) || (password.length <= 0) || (confirm_password.length <= 0))
	{
		errors.push({text: 'Please insert your Name'});
	}
	if(password != confirm_password)
	{
		errors.push({text: 'Password do not match'});
	}
	if(password.length < 4)
	{
		errors.push({text: 'Password must be at least 4 characters'});
	}
	if(errors.length > 0)
	{
		res.render('users/signup', {errors}/*, name, email, password, confirm_password}*/);
	}
	else
	{
		const emailUser = await User.findOne({email : email});
		if(emailUser)
		{
			req.flash('error_msg', 'The Email is already registered');
			res.redirect('/users/signup');
		}
		const newUser = new User({name, email, password});
		newUser.password = await newUser.encryptPassword(password);
		await newUser.save();
		req.flash('success_msg', 'You are registered');
		res.redirect('/users/signin');
	}
});


router.get('/profile', (req, res) => {
	res.render('profile');
});

router.get('/users/logout', (req, res) => {
	req.logout();
	res.redirect('/bookapp');
});

router.get('/bookapp', (req, res) => {
	res.render('bookapp');
});

router.get('/contactus', (req, res) => {
	res.render('contactus');
});

module.exports = router;