const router = require('express').Router();
const { json } = require('body-parser');
const passport = require('passport');
const genPassword = require('../config/passwordUtils').genPassword;
const connection = require('../config/database');
const isAuth = require('./authMiddleware').isAuth;
// const isAdmin = require('./authMiddleware').isAdmin;
const userExists = require('./authMiddleware').userExists;

/* GET users listing. */
router.get('/login', (req, res) => {
  console.log('in route /login ---->');
  // chack if exist message (in session) and render it.
  if (req.session.messages != undefined) {
    console.log('in');
    let lastInMessages = Object.keys(req.session.messages).length-1;
    let errorMessage = req.session.messages[Object.keys(req.session.messages)[lastInMessages]];
    res.render('login', {failureMessage: true, userNotExist: errorMessage });  //uses EJS to show alert
  }
  else{
    res.render('login', {failureMessage: true, userNotExist: '' });  //uses EJS to show alert
  }
}); 

router.get('/sighup',  (req, res) => {
  console.log(' inroute /sighup  ');
  res.render('sighUp', {alertUserExist: ''}); //uses EJS to show alert
});


router.get('/logout', (req, res) => {
          req.logout(function(err) {
               if (err) { 
                return next(err); 
              }
           res.redirect('/users/login');
      });
  });

router.post('/login', passport.authenticate('local', { failureMessage: true, failureRedirect: 'login'}), (req, res)=> {
  console.log('login post req');
  console.log('login post req body' + req.body);
  isAuth;
  console.log('login post is auth');
  res.redirect('/');
});

router.post('/register', userExists, (req, res, next) => {
  
  console.log('register');

  const saltHash = genPassword(req.body.password);
  
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  
  const insertQuery = "INSERT INTO users (first_name, last_name, phone, email, salt, hash) VALUES ('" + req.body.firstName + "','" + req.body.lastName + "','" +  req.body.phone + "','" +  req.body.email + "','" +  salt + "','" +  hash + "')";
  
  connection.query(insertQuery, (err) => {
    if(err){
      console.log(err);
    }
    else{
      console.log('successfully entered');
    }
  });

  res.redirect('login');
});



module.exports = router;