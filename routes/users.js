const router = require('express').Router();
const passport = require('passport');
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;
const userExists = require('./authMiddleware').userExists;
const addNewUser = require('../config/database').addNewUser;

/* GET users listing. */
router.get('/login', (req, res) => {
  console.log('in route /login ---->');
  // test if exist message (in session) and render it.
  if (req.session.messages != undefined) {
    let lastInMessages = Object.keys(req.session.messages).length-1;
    let errorMessage = req.session.messages[Object.keys(req.session.messages)[lastInMessages]];
    res.render('login', {failureMessage: true, userNotExist: errorMessage });  //uses EJS to show alert
  }
  else {
    res.render('login', {failureMessage: true, userNotExist: '' });  //uses EJS to show alert
  }
});

router.get('/sighup',  (req, res) => {
  console.log(' in route /sighup ---> ');
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
  if(req.user[0].admin == 'מנהל'){
    isAdmin;
    console.log('login post is admin');
    res.redirect('/management');
  }else{
    console.log('login post is auth');
    isAuth;
    res.redirect('/');
  }
});

router.post('/register', userExists, (req, res, next) => {
  
  console.log('register');
  
  addNewUser(req,res);

  res.redirect('login');
});


module.exports = router;