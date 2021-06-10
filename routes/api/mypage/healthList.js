var express = require('express');
var router = express.Router();

const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß

const defaultRes = require('../../../module/utils/utils');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const db = require('../../../module/pool');
const { Health } = require('aws-sdk');
/* 
건강데이터 목록
user_health 테이블에서 
토큰을 이용해 얻은 user_id를 이용해 
1. PATH : mypage/health 암 종류, 암 기수, 질병, 몸무게, 키, 건강상태 메모, 작성 날짜 SELECT해서 데이터로 전송
**데이터베이스 연결실패, 작성한 데이터가 존재 X, 데이터 검색 성공
=> 메소드 : GET, 헤더에 토큰 값
2. PATH : mypage/health/delete  삭제 하기 
=> 메소드 : POST, 헤더에 토큰 값 + 바디에 health_id 입력
3. PATH : mypage/health   편집 하기
**수정하는 날짜에 데이터가 있는지 확인 ->있으면 update, 없으면 insert
=> 메소드 : PUT, 헤더에 토큰 값 + 바디에 health_id 입력
4. PATH : mypage/health/:RegiDate 달 별 데이터 받아오기
RegiDate 형식 => YYYY-MM
=>메소드 : GET
헤더에 토큰 값 + 주소에 연 - 월로 입력 ex) mypage/health/2021-05
*/
//1. 데이터 받아오기
router.get('/', authUtil.isLoggedin, async(req, res) => {
    const checkuserQurey = "SELECT health_id, cancerNm, stageNm, progressNm, disease, weight, height, memo, DATE_FORMAT(RegiDate, '%y.%m.%d') AS RegiDate from user_health WHERE user_id = ? ORDER BY RegiDate DESC";
    const checkuserResult = await db.queryParam_Parse(checkuserQurey, [req.decoded.id])
    if (!checkuserResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else {//DB연결 성공
        if(checkuserResult[0]==null){ //작성한 건강 데이터가 없음 => 0으로 데이터 보냄
            res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.HEALTHLIST_SELECT_NULL));

        }
        else{//건강 데이터 존재 => 데이터 값 전송
            res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.HEALTHLIST_SELECT, checkuserResult));
        }
    }
})
//2. 삭제하기
router.delete('/delete/:health_id', authUtil.isLoggedin, async(req, res) => {
    const listDeleteQuery = "DELETE FROM user_health WHERE health_id = ? AND user_id = ?";
    const listDeleteResult = await db.queryParam_Parse(listDeleteQuery, [req.params.health_id, req.decoded.id]);
    if (!listDeleteResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else {//뿌려준 데이터를 가지고 확인하는거니 데이터는 존재 =>삭제만 하면 됨
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.HEALTHLIST_DELETE));
    }
})
//3. 편집하기
router.put('/update', authUtil.isLoggedin, async(req, res) => {
    const checkdayQuery = "SELECT * FROM user_health WHERE user_id = ? AND health_id = ?";
    const checkdayResult = await db.queryParam_Parse(checkdayQuery, [req.decoded.id, req.body.health_id]);
    if (!checkdayResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else{//DB 조회 성공
        const listUpdateQuery = "UPDATE user_health SET RegiDate = ? , relationNm = ?, gender = ?, age = ?, height = ?, weight = ?, cancerNm = ?, stageNm = ?, progressNm = ?, disease = ?, memo = ? WHERE health_id = ? AND user_id = ?";
        const listUpdateResult = await db.queryParam_Parse(listUpdateQuery, [checkdayResult[0].RegiDate,req.body.relationNm, req.body.gender, req.body.age, req.body.height, req.body.weight, req.body.cancerNm, req.body.stageNm, req.body.progressNm, req.body.disease, req.body.memo, req.body.health_id, req.decoded.id]);
        if(!listUpdateResult){
            res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
        }
        else{
            res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.HEALTHLIST_UPDATE));

        }
    }
})

//입력하기
router.post('/insert', authUtil.isLoggedin, async(req, res) => {
    const checkdayQuery = "SELECT * FROM user_health WHERE user_id = ? AND RegiDate = ?";
    const checkdayResult = await db.queryParam_Parse(checkdayQuery, [req.decoded.id, req.body.RegiDate]);
    if (!checkdayResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else{//DB 조회 성공
        if(checkdayResult[0]==null){
            const listInsertQuery = "INSERT INTO user_health (user_id,RegiDate,relationNm,gender,age,height,weight,stageNm,progressNm,cancerNm,disease,memo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)"
            const listInsertResult = await db.queryParam_Parse(listInsertQuery, [req.decoded.id,req.body.RegiDate,req.body.relationNm,req.body.gender,req.body.age,req.body.height,req.body.weight,req.body.stageNm
                ,req.body.progressNm,req.body.cancerNm,req.body.disease,req.body.memo]);
            const listUpdateQuery = "UPDATE user SET  relationNm = ?, gender = ?, age = ?, height = ?, weight = ?, cancerNm = ?, stageNm = ?, progressNm = ?, disease = ? WHERE user_id = ?";
            const listUpdateResult = await db.queryParam_Parse(listUpdateQuery, [req.body.relationNm, req.body.gender, req.body.age, req.body.height, req.body.weight, req.body.cancerNm, req.body.stageNm, req.body.progressNm, req.body.disease, req.decoded.id]);
            if(!listInsertResult){
                res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
            }
            else{
                res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.HEALTHLIST_INSERT));
        
            }
        }
        else{
            res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.HEALTHLIST_FAIL));
        }
    }
})
//4. 달별로 데이터 받아오기
router.get('/:RegiDate', authUtil.isLoggedin, async(req, res) => {
    const checkuserQurey = "SELECT health_id, cancerNm, stageNm, progressNm, disease, weight, height, memo, DATE_FORMAT(RegiDate, '%y.%m.%d') AS RegiDate from user_health WHERE user_id = ? AND RegiDate LIKE '%"+ req.params.RegiDate +"%' ORDER BY RegiDate DESC";
    const checkuserResult = await db.queryParam_Parse(checkuserQurey, [req.decoded.id])
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
 
//5. health_id로 상세정보 넘겨서 건강데이터 추가입력에 사용하게 만들기
router.get('/list/:health_id', authUtil.isLoggedin, async(req, res) => {
    const checkuserQurey = "SELECT DATE_FORMAT(RegiDate, '%Y.%m.%d') AS RegiDate, relationNm, gender, age, height, weight, cancerNm, stageNm, progressNm, disease, memo from user_health WHERE user_id = ? AND health_id = ?";
    const checkuserResult = await db.queryParam_Parse(checkuserQurey, [req.decoded.id, req.params.health_id])
    console.log(checkuserResult)
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

router.get('/detail/list', authUtil.isLoggedin, async(req, res) => {
    const checkuserQurey = "SELECT relationNm, gender, age, height, weight, cancerNm, stageNm, progressNm, disease from user WHERE user_id = ?";
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