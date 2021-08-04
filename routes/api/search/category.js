var express = require('express');
var router = express.Router();

const jwt = require("../../../module/jwt");

const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');


/*
1. 음식 카테고리 별 최신순 
2. 음식 카테고리 별 좋아요순
필요 테이블 : food_thumbnail
필요 컬럼 : food_id, name, img, category, background_color, nutrition1, wishes, likes, views, regiDate
1, 2 구분은 likes, regiDate
method : get

*/

router.get('/recent/:category', async(req, res) => {
    const Query = "SELECT food_id, name, img, category, background_color, nutrition1, wishes, likes, views, regiDate "
    + 'FROM food_thumbnail '
    + 'WHERE category = ? '
    + 'ORDER BY regiDate DESC';
    const Result = await db.queryParam_Parse(Query, req.params.category)
    if (Result[0]==null) { //셀렉트 결과 값이 없음
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.NULL_VALUE));
    }
    else {
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.CATEGORY_FOOD_SELECT,{Result}));

    }
   
})
router.get('/likes/:category', async(req, res) => {
    const Query = "SELECT food_id, name, img, category, background_color, nutrition1, wishes, likes, views, regiDate "
    + 'FROM food_thumbnail '
    + 'WHERE category = ? '
    + 'ORDER BY likes DESC';
    const Result = await db.queryParam_Parse(Query, req.params.category)
    if (Result[0]==null) { //셀렉트 결과 값이 없음
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.NULL_VALUE));
    }
    else {
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.CATEGORY_FOOD_SELECT,{Result}));

    }
   
})

module.exports = router;