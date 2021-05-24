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
메인페이지 전해 줄 값 => 닉네임, 이름, 암 명, 암 기수, 현재 상태, 기타 질병 
헤더에 토큰 전달
*/
router.get('/', authUtil.isLoggedin, async(req, res) => {
    const checkuserQurey = "SELECT * from user WHERE user_id = ?";
    const checkuserResult = await db.queryParam_Parse(checkuserQurey, [req.decoded.id])

    if (!checkuserResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else {
        info ={
            "nickname" : checkuserResult[0].nickname,
            "name" : checkuserResult[0].name,
            "cancerNm" : checkuserResult[0].cancerNm,
            "stageNm" : checkuserResult[0].stageNm,
            "progressNm" : checkuserResult[0].progressNm,
            "disease" : checkuserResult[0].disease
        }
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.PATIENT_INFO_SELECT, info));
        
    }
})
module.exports = router;