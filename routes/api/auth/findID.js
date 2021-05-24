var express = require('express');
var router = express.Router();

const jwt = require("../../../module/jwt");

const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');



router.get('/:name/:phone', async(req, res) => {
    const findIDQurey = "SELECT email from user WHERE name = ? AND phone = ?";
    const findIDResult = await db.queryParam_Parse(findIDQurey, [req.params.name, req.params.phone]);

    if (!findIDResult) { //DB 에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));
        
    }
    else {
        if(findIDResult[0]==null){ //이름과 핸드폰 번호에 맞는 이메일이 존재하지 않음
            res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.EMAIL_NOT_FOUND));

        }
        else{ // 아이디 찾기 성공
            res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.FIND_ID, findIDResult[0].email));

        }

    }
   
})
module.exports = router;