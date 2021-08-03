var express = require('express');
var router = express.Router();

const jwt = require("../../../module/jwt");

const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');


/*
1. 질병명으로 랭킹별 추천 음식 검색하기(초기화면 최대 4개)
필요 테이블 : cancer_food, food_thumbnail
필요 컬럼 : cancer_food[cancerNm, food], food_thumbnail[name, img, background_color, nutrition1] 
공통 컬럼 : food = name
랭킹을 현재는 조회수로 집계

2. 질병명으로 랭킹별 추천 음식 검색하기(더보기 누르면 전부 보이도록 LIMIT 해제)
위와 동일

*/

router.get('/:cancerNm', async(req, res) => {
    const Qurey = "SELECT A.cancerNm, A.food, B.img, B.background_color, B.nutrition1, B.views"
    +' FROM cancer_food A, food_thumbnail B'
    + ' WHERE A.food = B.name AND A.cancerNm = ? '
    + 'ORDER BY views DESC LIMIT 4 ';
    const Result = await db.queryParam_Parse(Qurey, req.params.cancerNm)
    if (Result[0]==null) { //셀렉트 결과 값이 없음
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.NULL_VALUE));
    }
    else {
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.CANCER_FOOD_SELECT,{Result}));

    }
   
})

router.get('/:cancerNm/plus', async(req, res) => {
    const Qurey = "SELECT A.cancerNm, A.food, B.img, B.background_color, B.nutrition1, B.views"
    +' FROM cancer_food A, food_thumbnail B'
    + ' WHERE A.food = B.name AND A.cancerNm = ? '
    + 'ORDER BY views DESC';
    const Result = await db.queryParam_Parse(Qurey, req.params.cancerNm)
    if (Result[0]==null) { //셀렉트 결과 값이 없음
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.NULL_VALUE));
    }
    else {
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.CANCER_FOOD_SELECT,{Result}));

    }
   
})
module.exports = router;