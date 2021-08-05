var express = require('express');
var router = express.Router();

const jwt = require("../../../module/jwt");

const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');

const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß


/*
1. 최근 검색 기록 불러오기
필요 테이블 : search_log
필요 컬럼 : search_log_id, user_id, text, datetime
method : get
대신 현재 검색 기능엔 저장 기능이 존재하지 않다. 
-> 추가하기


*/
router.get('/' , authUtil.isLoggedin, async(req, res) => {
    const checkuserQurey = "SELECT search_log_id, user_id, text, datetime "
    + "FROM search_log "
    + "WHERE user_id = ? "
    + "ORDER BY datetime DESC "
    + "LIMIT 4";
    const checkuserResult = await db.queryParam_Parse(checkuserQurey, req.decoded.id)

    if (!checkuserResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else {//데이터베이스 연결 성공 => 데이터 존재할 때, 존재 안 할 때 구분
        if(checkuserResult[0]==null){
            res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.HEALTHLIST_SELECT_NULL));
        }
        else{
            res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.HEALTHLIST_SELECT, checkuserResult));
        }
    }
})
module.exports = router;
