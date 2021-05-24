var express = require('express');
var router = express.Router();

const jwt = require("../../../module/jwt");

const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');



router.post('/', async(req, res) => {
    const Qurey = "SELECT * from user WHERE email = ?";
    const Result = await db.queryParam_Parse(checkuserQurey, [req.body.email])

    if (checkuserResult[0]==null) { //이메일로 셀렉트 결과 값이 없음
        res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.EMAIL_NOT_FOUND));
        
    }
    else {
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.SIGNIN_SUCCESS,{Token}));

    }
   
})
module.exports = router;