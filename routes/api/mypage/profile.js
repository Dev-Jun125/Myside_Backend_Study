var express = require('express');
var router = express.Router();
const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß

const jwt = require("../../../module/jwt");

const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');


/*
#프로필 수정#

*/
router.post('/', authUtil.isLoggedin, async(req, res) => {
    const checkuserQurey = "SELECT * from user WHERE user_id = ?";
    const checkuserResult = await db.queryParam_Parse(checkuserQurey, [req.decoded.id])
    if (!checkuserResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else {//
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.PATIENT_INFO_SELECT, checkuserResult));

    }
})
module.exports = router;