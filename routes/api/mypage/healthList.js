var express = require('express');
var router = express.Router();
const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß

const jwt = require("../../../module/jwt");
var moment = require('moment');
const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');

/* 
건강데이터 목록
user_health 테이블에서 
토큰을 이용해 얻은 user_id를 이용해 
1. PATH : mypage/healthList 암 종류, 암 기수, 질병, 몸무게, 키, 건강상태 메모, 작성 날짜 SELECT해서 데이터로 전송
=> 메소드 : GET, 헤더에 토큰 값
2. PATH : mypage/healthList/delete   삭제 하기 
=> 메소드 : POST, 헤더에 토큰 값 + 바디에 health_id 입력
3. PATH : mypage/healthList/update   편집 하기
=> 메소드 : POST, 헤더에 토큰 값 + 바디에 health_id 입력
4. PATH : mypage/healthList/:RegiDate
RegiDate 형식 => YYYY-MM
=>메소드 : GET
헤더에 토큰 값 + 주소에 연 - 월로 입력 ex) 2021-05
*/

router.get('/', authUtil.isLoggedin, async(req, res) => {
    const checkuserQurey = "SELECT health_id, cancerNm, stageNm, progressNm, disease, weight, height, memo, DATE_FORMAT(RegiDate, '%Y.%m.%d') from user_health WHERE user_id = ? ORDER BY RegiDate DESC";
    const checkuserResult = await db.queryParam_Parse(checkuserQurey, [req.decoded.id])
    if (!checkuserResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else {//
  
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.PATIENT_INFO_SELECT, checkuserResult));
        
    }
})

router.post('/delete', authUtil.isLoggedin, async(req, res) => {
    const listDeleteQuery = "DELETE FROM user_health WHERE health_id = ? AND user_id = ?";
    const listDeleteResult = await db.queryParam_Parse(listDeleteQuery, [req.body.health_id, req.decoded.id]);
    if (!listDeleteResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else {//
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.PATIENT_INFO_DELETE));

    }
})
router.post('/update', authUtil.isLoggedin, async(req, res) => {
    const listUpdateQuery = "UPDATE user_health SET RegiDate, relationNm, gender, age, height, weight, cancerNm, stageNm, progressNm, disease, disable_food, memo WHERE health_id = ? AND user_id = ?";
    const listUpdateResult = await db.queryParam_Parse(listUpdateQuery, [now(), req.body.relationNm, req.body.gender, req.body.age, req.body.height, req.body.weight, req.body.cancerNm, req.body.stageNm, req.body.progressNm, req.body.disease, req.body.disable_food, req.body.memo, req.decoded.id, req.body.user_id]);
    if (!listUpdateResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else {//
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.PATIENT_INFO_UPDATE));

    }
})
//
router.get('/:RegiDate', authUtil.isLoggedin, async(req, res) => {
    const checkuserQurey = "SELECT health_id, cancerNm, stageNm, progressNm, disease, weight, height, memo, DATE_FORMAT(RegiDate, '%Y-%m-%d') from user_health WHERE user_id = ? AND RegiDate LIKE '%"+ req.params.RegiDate +"%'";
    const checkuserResult = await db.queryParam_Parse(checkuserQurey, [req.decoded.id])
    console.log(checkuserResult)
    if (!checkuserResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else {//
  
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.PATIENT_INFO_SELECT, checkuserResult));
        
    }
})
module.exports = router;

