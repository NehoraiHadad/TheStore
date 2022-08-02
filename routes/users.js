const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../config/passwordUtils').genPassword;
const connection = require('../config/database');
const isAuth = require('./authMiddleware').isAuth;
// const isAdmin = require('./authMiddleware').isAdmin;
const userExists = require('./authMiddleware').userExists;

/* GET users listing. */
router.get('/login', (req, res) => {
    res.render('login', {failureMessageAlert:false});
});

router.get('/sighup',  (req, res) => {
  res.render('sighUp', {alertUserExist: ''}); //uses EJS to show alert
});


router.get('/logout', (req, res) => {
          req.logout(function(err) {
               if (err) { 
                return next(err); 
              }
           res.redirect('/');
      });
  });

router.post('/login', passport.authenticate('local', { failureMessage: true, failureRedirect: 'login'}), (req, res)=> {
  console.log(req);
  isAuth;
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