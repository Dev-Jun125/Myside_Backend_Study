var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/main', require('./main.js'));
router.use('/board', require('./board.js'));
router.use('/users', require('./users.js'));
router.use('/', require('./api/index.js'));

module.exports = router;
