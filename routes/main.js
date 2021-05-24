

var express = require('express');
var router = express.Router();

const resMessage = require('../module/utils/responseMessage');
const statusCode = require('../module/utils/statusCode');
const defaultRes = require('../module/utils/utils');

const db = require('../module/pool');



router.get('/', async (req, res) => {
    const getBoardQuery = "SELECT * FROM board";
    const getBoardResult = await db.queryParam_None(getBoardQuery);

    if (!getBoardResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.SELECT_PICTURES_FAILED));
        
    

    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SELECT_PICTURES_SUCCESS, getBoardResult));

    }
});

module.exports = router;