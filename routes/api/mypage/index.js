var express = require('express');
var router = express.Router();


router.use("/changePW", require("./changePW"));
router.use("/main", require("./main"));
router.use("/healthList", require("./healthList"));


module.exports = router;