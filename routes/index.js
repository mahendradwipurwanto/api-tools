var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({status: 'ok', message: 'Welcome to the Tools API'});
});

module.exports = router;
