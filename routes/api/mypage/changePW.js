var express = require('express');
var router = express.Router();
const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß

const jwt = require("../../../module/jwt");

const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');



router.post('/', authUtil.isLoggedin, async(req, res) => {
    const checkuserQurey = "SELECT * from user WHERE user_id = ?";
    const checkuserResult = await db.queryParam_Parse(checkuserQurey, [req.decoded.id])
    if (!checkuserResult) { //DB에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
    }
    else {//유저정보 가져옴 => 입력하는 현재 비밀번호 맞는지 확인=> 새 비밀번호, 새 비밀번호 확인이 일치하는지 확인 => 일치하면 비밀번호 변경
        const salt = checkuserResult[0].salt;
        const hashedEnterPw = await crypto.pbkdf2(req.body.password, salt, 1000, 32, 'SHA512') //입력한 패스워드 암호화
        const dbPw = checkuserResult[0].password  //현재 저장된 패스워드
        const pw = hashedEnterPw.toString('base64')
        if(pw == dbPw){
            if(req.body.newpassword == req.body.renewpassword){
                const salt = checkuserResult[0].salt;
                const hashedEnterPw = await crypto.pbkdf2(req.body.newpassword, salt, 1000, 32, 'SHA512') //입력한 패스워드 암호화
                const pw = hashedEnterPw.toString('base64')
                const changePWQuery = "UPDATE user SET password = ? WHERE user_id = ?";
                const changePWResult = await db.queryParam_Parse(changePWQuery, [pw, req.decoded.id]);
                if(!changePWResult){// 디비에러
                    res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));        
                }
                else{//변경 성공
                    res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.CHANGE_PASSWORD));
                }

            }
            else{//새 비밀번호와 새비밀번호 확인 값이 다를 경우 에러 메시지
                res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.PW_CHECK_ERROR));        
            }
            
        }
        else{//현재 비밀번호와 현재 비밀번호 입력값이 일치하지 않을 때 에러 메시지
            res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.PW_ERROR));        
        }
        }

    
    

})
module.exports = router;