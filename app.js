const createError = require('http-errors');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const connection = require('./config/database');

const MySQLStore = require('express-mysql-session')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const managementRouter = require('./routes/management');

const HOUR = 1000 * 60 * 60;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session setup
// express-mysql-session connection https://www.npmjs.com/package/express-mysql-session
const sessionStore = new MySQLStore({createDatabaseTable: true, collection: 'session'}, connection);

app.use(session({
  name: 'user',
  secret: 'user secret',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: (HOUR * 3)
  }
}));

// passport
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log( 'log from app.js -----> ');
  console.log(req.user);
  next();
});

// router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/management', managementRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
