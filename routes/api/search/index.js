var express = require('express');
var router = express.Router();


router.use("/cancer", require("./cancer"));
router.use("/category", require("./category"));




module.exports = router;