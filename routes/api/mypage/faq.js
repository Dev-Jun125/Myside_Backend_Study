var express = require('express');
var router = express.Router();

const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß

const defaultRes = require('../../../module/utils/utils');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const db = require('../../../module/pool');
const { Health } = require('aws-sdk');


router.get('/', async(req, res) => {
    const checkfaqQurey = "SELECT * from faq ORDER BY RegiDate DESC";
    const checkfaqResult = await db.queryParam_None(checkfaqQurey)
    if (!checkfaqResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else {//DB연결 성공
        if(checkfaqResult[0]==null){ //작성한 건강 데이터가 없음 => 0으로 데이터 보냄
           res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.FAQ_NULL));
        }
        else{//건강 데이터 존재 => 데이터 값 전송
            res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.FAQ_SUCCESS, checkfaqResult));
        }
    }
});



module.exports = router;