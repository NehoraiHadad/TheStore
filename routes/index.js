const express = require('express');
const router = express.Router();
const isAuth = require('./authMiddleware').isAuth;
const mainInfoController = require('../controller/mainInfoController');
const productController = require('../controller/productController');


/* GET home page. */
router.get('/', isAuth, function(req, res, next) {
    console.log("get from index routs?");
    res.render('index', {name: ''});  //never 'get' from here. isAuth method do usually the 'render'.
});


router.post('/', async (req, res) => {
    const categoryArray = await mainInfoController.categoryList();
    const costumerServicesStore = await mainInfoController.costumerServicesStore();
    const searchProduct = await productController.searchProduct(req, res);

    res.render('index', {name: req.user[0].first_name, costumerServicesStore: costumerServicesStore[0], products: searchProduct, category: categoryArray})
});


router.get('/category/:category', async (req, res)=>{
    const categoryArray = await mainInfoController.categoryList();
    const costumerServicesStore = await mainInfoController.costumerServicesStore();
    const categoryProduct = await productController.categoryProduct(req, res);

    res.render('index', {name: req.user[0].first_name, costumerServicesStore: costumerServicesStore[0], products: categoryProduct, category: categoryArray})
})


router.get('/sale', async (req, res) => {
    const categoryArray = await mainInfoController.categoryList();
    const costumerServicesStore = await mainInfoController.costumerServicesStore();
    const saleProducts = await productController.saleProducts();

    res.render('index', {name: req.user[0].first_name, costumerServicesStore: costumerServicesStore[0], products: saleProducts, category: categoryArray})
})

module.exports = router;