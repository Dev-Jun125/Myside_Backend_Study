var express = require('express');
var router = express.Router();

const db = require('../../../module/pool');

const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

router.post('/email', async(req, res)=>{
    const checkemailQuery = "SELECT email FROM user WHERE email = ?"
    const checkemailResult = await db.queryParam_Parse(checkemailQuery, req.body.email);
    console.log(checkemailResult);

    if (!checkemailResult) {
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else{
        if(checkemailResult[0]==null){ 
            res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.DUPLICATED_ID_SUCCESS));
    }
        else{
            res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.DUPLICATED_ID_FAIL));
    }
}

})

router.post('/nickname', async(req, res)=>{
    const checkemailQuery = "SELECT nickname FROM user WHERE nickname = ?"
    const checkemailResult = await db.queryParam_Parse(checkemailQuery, req.body.nickname);
    console.log(checkemailResult);

    if (!checkemailResult) {
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else{
        if(checkemailResult[0]==null){ 
            res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.DUPLICATED_NICKNAME_SUCCESS));
    }
        else{
            res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.DUPLICATED_NICKNAME_FAIL));
    }
}
})

router.post('/password', authUtil.isLoggedin, async(req, res) => {
    const checkuserQurey = "SELECT * from user WHERE user_id = ?";
    const checkuserResult = await db.queryParam_Parse(checkuserQurey, [req.decoded.id])

    if (!checkuserResult) {
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else{
        const salt = checkuserResult[0].salt;
        const hashedEnterPw = await crypto.pbkdf2(req.body.password, salt, 1000, 32, 'SHA512') //입력한 패스워드 암호화
        const dbPw = checkuserResult[0].password  //현재 저장된 패스워드
        const pw = hashedEnterPw.toString('base64')
        if(pw == dbPw){
            res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.PW_CHECK_SUCCESS));
        }
        else{
            res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.PW_ERROR));

        }
    }
})
module.exports = router;