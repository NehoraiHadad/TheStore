
const router = require('express').Router();

router.get('/', (req,res) => {
    res.render('management', {name: ''}); //uses EJS to show admin name
});

module.exports = router;
