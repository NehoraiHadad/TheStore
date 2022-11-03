const connection = require("../config/database");
const mainInfoController = require('../controller/mainInfoController');
const productController = require('../controller/productController');


module.exports.isAuth = async (req, res, next) => {
    console.log('In ==============> isAuth');

    const categoryArray = await mainInfoController.categoryList();
    const costumerServicesStore = await mainInfoController.costumerServicesStore();
    const allProducts = await productController.allProduct();
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        res.render('index', {name: req.user[0].first_name, costumerServicesStore: costumerServicesStore[0], products: allProducts, category: categoryArray});
    } else {
        // res.status(401).json({ msg: 'You are not authorized to view this resource' });
        res.redirect('/users/login');
    }
}


module.exports.isAdmin = (req, res, next) => {
    console.log('In ================> isAdmin');
    
    if (req.isAuthenticated() && req.user[0].admin == "מנהל") {
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.'});
    }
}

function userExists(req, res, done) {
    console.log('In ==> userExist');
    connection.query('SELECT * FROM users WHERE email = ? ', [req.body.email], (err, results) => {
        console.log(results);
        if (err) {
            return done(err);
        }
        if (results.length) {
            console.log('user exist already');
            res.redirect('sighUp', {alertUserExist: 'משתמש זה כבר קיים במערכת'});
        }
        else{
            done();
        }
    })
}

module.exports.userExists = userExists;