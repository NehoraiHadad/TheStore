const connection = require("../config/database");

module.exports.isAuth = (req, res, next) => {
    console.log('is Auth');
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        res.render('index', {name: JSON.stringify(req.user[0].first_name)
        });
    } else {
        // res.status(401).json({ msg: 'You are not authorized to view this resource' });
        res.redirect('/users/login');
    }
}


module.exports.isAdmin = (req, res, next) => {
    console.log('is Admin');

    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
    }
}


function userExists(req, res, done) {
    console.log('userExist');
    connection.query('SELECT * FROM users WHERE email = ? ', [req.body.email], (err, results) => {
        console.log(results);
        if (err) {
            return done(err);
        }
        if (results.length) {
            console.log('user exist already');
            res.render('sighUp', {alertUserExist: 'משתמש זה כבר קיים במערכת'});
        }
        else{
            done();
        }
    })
}

module.exports.userExists = userExists;