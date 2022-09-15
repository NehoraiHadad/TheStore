const router = require('express').Router();
const userController = require('../controller/userController');
const isAdmin = require('./authMiddleware').isAdmin;

router.get('/',isAdmin , userController.viewAll);
router.post('/',isAdmin , userController.searchUser);
router.get('/viewUser/:id',isAdmin ,userController.viewUser);
router.get('/editUser/:id',isAdmin ,userController.editUser);
router.post('/editUser/:id',isAdmin ,userController.updateUser);
router.get('/addUser',isAdmin ,userController.addUser);
router.post('/addUser',isAdmin ,userController.addUserPost);
router.get('/delete/:id',isAdmin ,userController.deleteUser);

module.exports = router;
