var express = require('express');
var router = express.Router();



const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');

router.post('/', async(req, res) => {
    const signupQuery = "INSERT INTO user(email, name, phone, password, relationNm, nickname, cancerNm, stageNm, progressNm, gender, age, height, weight, disease, disable_food, salt) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const buf = await crypto.randomBytes(64);
    const salt = buf.toString('base64');
    const hashedPw = await crypto.pbkdf2(req.body.password, salt, 1000, 32, 'SHA512')
    const signupResult = await db.queryParam_Parse(signupQuery, [req.body.email, req.body.name, req.body.phone, hashedPw.toString('base64'), req.body.relationNm, req.body.nickname, req.body.cancerNm, req.body.stageNm, req.body.progressNm, req.body.gender, req.body.age, req.body.height, req.body.weight, req.body.disease, req.body.disable_food, salt]);
   
    if (!signupResult) {
        res.status(200).send("DB 오류");
    }
    else{
        res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.SIGNUP_SUCCESS));

    }
})
module.exports = router;