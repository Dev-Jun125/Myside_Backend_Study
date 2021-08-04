var express = require('express');
var router = express.Router();

const jwt = require("../../../module/jwt");

const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');


/*
인규형거 보고 깨달음...

1. 영양 성분 검색 -> 영양 성분 포함된 음식 결과 값 
-> 성분 검색 결과 없으면 없음 표시
필요 테이블 : nutrition
필요 컬럼 : nutrition[name, name_kr](한글 명 찾기), food_detail[](영양소 존재여부 확인), cancer_food[cancerNm, food](영양성분이 든 음식과 암 조합), 
            food thumbnail[name, img, background_color, nutrition1, nutrition2, nutrition3, nutrition4, likes, wishes](이외 보여줘야하는 부분)
name = food
method = get
영영소 4개 중 1개 이상 포함된 음식 찾기
*/

router.get('/:nutritionName', async(req, res) => {
    const Qurey = "SELECT name FROM nutrition WHERE name_kr = ?";
    const Result = await db.queryParam_Parse(Qurey, req.params.nutritionName);
    console.log(Result);
    const nutritionName = Result[0].name;
    console.log(nutritionName);
    if (!Result) { //디비에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.NULL_VALUE));
    }
    else {
        if(Result[0]==null){//찾는 영양소 X
            res.status(200).send(defaultRes.successFalse(statuscode.NO_CONTENT, resMessage.NULL_VALUE));
        }
        else{
            const Query = "SELECT A.name, A.img, A.background_color, A.nutrition1, A.likes, A.wishes, cancerNm = (SELECT cancerNM FROM cancer_food A, food_thumbnail B WHERE A.food = B.name) " 
            const Query = "SELECT  A.cancerNm, status, Vitamin_C AS nutrition, B.name, img, background_color FROM (SELECT * FROM cancer_food A, food_detail B WHERE A.food = B.name)A, food_thumbnail B WHERE A.name = B.name AND Vitamin_C>0 ORDER BY Vitamin_C DESC";
            
            res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.CANCER_FOOD_SELECT,{Result}));
        }
    }
})


module.exports = router;