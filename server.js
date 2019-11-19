const express = require('express');
const path = require('path');
const multer = require('multer');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash =  require('connect-flash');
const passport = require('passport');
const bodyParser = require('body-parser');


// Initializations
const app = express();
require('./database');
require('./config/passport');
require('./views/Layouts/main.hbs');

// Settings
//exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/Kassandra-blog-post";
//app.set('port', process.env.PORT || 8080);

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
	defaultLayout: 'main', 
	layoutsDir: path.join(app.get('views'), 'layouts'),
	//partialsDir: path.join(app.get('views'), 'partials'),
	extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
	secret: 'mysecretapp',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(multer({dest: path.join(__dirname, './public/uploads/bookCovers')}).single('image'));	//Aqui es donde se subira la imagen
//app.use(bodyParser.urlencoded({limit: '10mb', extended:false}))

// Global Variables
app.use((req, res, next) => 
{
	res.locals.succes_msg = req.flash('succes_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

//Routes
//app.use(require('./routes/index.js'));
app.use(require('./routes/books.js'));
app.use(require('./routes/users.js'));
//app.use(require('./routes/search.js'));

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Server is listenning
app.listen(port, host, () => 
{
	console.log("Server on port");
});