var express = require('express');
var router = express.Router();


router.use("/cancer", require("./cancer"));
router.use("/category", require("./category"));
router.use("/nutrition", require("./nutrition"));
router.use("/searchLog", require("./searchLog"));




module.exports = router;