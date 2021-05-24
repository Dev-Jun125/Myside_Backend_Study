var express = require('express');
var router = express.Router();


router.use("/check", require("./check"));
router.use("/signup", require("./signup"));
router.use("/signin", require("./signin"));
router.use("/findID", require("./findID"));
router.use("/findPW", require("./findPW"));
router.use("/refresh", require("./refresh"));



module.exports = router;