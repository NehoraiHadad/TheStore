const router = require('express').Router();
const userController = require('../controller/userController');

router.get('/', userController.viewAll);
router.get('/viewUser/:id', userController.viewDetails);

module.exports = router;
