const express = require('express');
const router = express.Router();
const isAuth = require('./authMiddleware').isAuth;

// !! uses in tests only. usually rendering => /users/login => /index !!
/* GET home page. */
router.get('/', isAuth, function(req, res, next) {
    res.render('index', {name: ''});  //uses EJS to show name user
});
   
module.exports = router;