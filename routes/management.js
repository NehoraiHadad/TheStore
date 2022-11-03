const router = require('express').Router();
const userController = require('../controller/userController');
const productController = require('../controller/productController');
const mainInfoController = require('../controller/mainInfoController');
const isAdmin = require('./authMiddleware').isAdmin;


// "management" rendering
router.get('/', isAdmin, async (req,res) => {
    const categoryArray = await mainInfoController.categoryList();
    const costumerServicesStore = await mainInfoController.costumerServicesStore(req, res);
    res.render('management',{name: req.user[0].first_name, alert: '', categoryArray, costumerServicesStore: costumerServicesStore[0]});
});


// main details routes
router.post('/', isAdmin, mainInfoController.updateChanges);


// users routes
router.get('/users', isAdmin, async (req,res) => {
    const userRows = await userController.viewAll(req, res);
    const costumerServicesStore = await mainInfoController.costumerServicesStore(req, res);
    res.render('users',{ userRows, name: req.user[0].first_name, alert: '', costumerServicesStore: costumerServicesStore[0]});
});


// search users 
router.post('/users',isAdmin , async (req,res)=> {
    const userRows = await userController.searchUser(req, res);
    const costumerServicesStore = await mainInfoController.costumerServicesStore(req, res);

    res.render('users',{ userRows, name: req.user[0].first_name, alert: '', costumerServicesStore: costumerServicesStore[0]});
});


router.get('/viewUser/:id' ,isAdmin ,userController.viewUser);
router.get('/editUser/:id' ,isAdmin ,userController.editUser);
router.post('/editUser/:id' ,isAdmin ,userController.updateUser);
router.get('/addUser' ,isAdmin ,userController.addUser);
router.post('/addUser' ,isAdmin ,userController.addUserPost);
router.get('/delete/:id' ,isAdmin ,userController.deleteUser);


// products routes
router.get('/products', isAdmin, async (req,res) => {
    const productRows = await productController.allProduct(req, res);
    const costumerServicesStore = await mainInfoController.costumerServicesStore(req, res);

    res.render('products',{productRows, name: req.user[0].first_name, alert: '', costumerServicesStore: costumerServicesStore[0]});
});


// search product
router.post('/products',isAdmin , async (req,res)=> {
    const productRows = await productController.searchProduct(req, res);
    const costumerServicesStore = await mainInfoController.costumerServicesStore(req, res);

    res.render('products',{productRows, name: req.user[0].first_name, alert: '', costumerServicesStore: costumerServicesStore[0]});
});


router.get('/editProduct/:id' ,isAdmin ,productController.editProduct);
router.post('/editProduct/:id' ,isAdmin ,productController.updateProduct);
router.get('/addProduct', isAdmin, productController.addProduct);
router.post('/addProduct', isAdmin, productController.addProductPost);
router.get('/viewProduct/:id', isAdmin, productController.viewProduct);
router.get('/notInStock/:id', isAdmin, productController.notInStock);


module.exports = router;