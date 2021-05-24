var express = require('express');
var router = express.Router();

const jwt = require("../../../module/jwt");

const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');

const crypto = require('crypto-promise');



router.post('/', async(req, res) => {
    password = req.body.password
    const checkuserQurey = "SELECT * from user WHERE email = ?";
    const checkuserResult = await db.queryParam_Parse(checkuserQurey, [req.body.email])

    if (checkuserResult[0]==null) { //이메일로 셀렉트 결과 값이 없음
        res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.EMAIL_NOT_FOUND));
    }
    else{//아이디 있음 => 비밀번호 체크 시작 => 비밀번호는 암호화 상태 => 암호화한 비밀번호와 동일한지
        const salt = checkuserResult[0].salt;
        const hashedEnterPw = await crypto.pbkdf2(req.body.password, salt, 1000, 32, 'SHA512') //입력한 패스워드 암호화
        const dbPw = checkuserResult[0].password  //현재 저장된 패스워드
        console.log(hashedEnterPw.toString('base64'));
        console.log(dbPw);
        if (hashedEnterPw.toString('base64') == dbPw) { //비밀번호 일치 => 토큰 발행
            const tokens = jwt.sign(checkuserResult[0]);
            const Token = tokens.token;
            const refreshToken = tokens.refreshToken;
            const giveTokenQuery = "UPDATE user SET accessToken = ?, refreshToken = ? WHERE email = ?";
            const giveTokenResult = await db.queryParam_Parse(giveTokenQuery, [Token, refreshToken, req.body.email]);
            
            if(!giveTokenResult){ // 토큰 입력 결과를 못줬으면 디비 에러
                res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));

            }
            else{//데이터베이스 입력 성공 = 로그인 성공 => 토큰 발행 완료 => 클라이언트에 토큰 값과 로그인 성공 여부 전달
                res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.SIGNIN_SUCCESS,{tokens}));
            }
        }
        else{ // 비밀번호 불일치
            res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.SIGNIN_FAIL));

        }

    }
})
module.exports = router;