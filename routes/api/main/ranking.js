var express = require('express');
var router = express.Router();

const jwt = require("../../../module/jwt");

const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');

/*
1. 좋아요가 많은 음식
메소드 : get
필요 테이블 : food_thumbnail, cancer_food
필요 컬럼 : food_thumbnail[food_id, name, background_color, img, nutrition1, likes, wishes]
            cancer_food[cancer_food_id, cancerNm, food]

좋아요 수가 많은 음식 찾음 -> 음식 명으로 관련된 암 찾기 결과 합쳐서 ??
*/

router.get('/like', async(req, res) => {
    const likeQuery = "SELECT name from food_thumbnail ORDER BY likes DESC LIMIT 4";
    const likeResult = await db.queryParam_None(likeQuery);
    console.log(likeResult[1]);
    if (!likeResult) { //DB오류
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));
    }
    else {
        
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.SIGNIN_SUCCESS,{likeResult}));

    }
   
})
module.exports = router;