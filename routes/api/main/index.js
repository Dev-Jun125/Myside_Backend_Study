var express = require('express');
var router = express.Router();


router.use("/ranking", require("./ranking"));



module.exports = router;