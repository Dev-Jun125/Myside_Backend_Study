var express = require('express');
var router = express.Router();

const jwt = require("../../../module/jwt");
const nodemailer = require('nodemailer');
const db = require('../../../module/pool');
const statuscode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const defaultRes = require('../../../module/utils/utils');
const email = require('../../../config/emailConfig.json');
const crypto = require('crypto-promise');
const mailer = require('./mail')

/*
이메일과 이름 입력받아서 셀렉트 결과 값 존재=> 비밀번호 초기화, 이메일로 변경된 패스워드 전송
*/
router.post('/', async(req, res) => {
    const findPWQurey = "SELECT * from user WHERE name = ? AND email = ?";
    const findPWResult = await db.queryParam_Parse(findPWQurey, [req.body.name, req.body.email]);
    if (!findPWResult) { //디비 에러
        res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));
    }
    else {//이름과 이메일 확인 완료 => 비밀번호 초기화 및 이메일 전송
        if(findPWResult[0]==null){//이름 혹은 비밀번호가 맞지않으면 틀렸다고 전송
            res.status(200).send(defaultRes.successFalse(statuscode.OK, resMessage.NAME_EMAIL_NOT_FOUND));
        }
        else{
            const randomString = Math.random().toString(36).slice(2); // 랜덤 값 출력
            const salt = findPWResult[0].salt;
        const hashchangePw = await crypto.pbkdf2(randomString, salt, 1000, 32, 'SHA512')
        const changePW = hashchangePw.toString('base64')
        const changePWQuery = "UPDATE user SET password = ? WHERE name = ? AND email = ?";
        const changePWResult = await db.queryParam_Parse(changePWQuery, [changePW, req.body.name, req.body.email]);

        if(!changePWResult){ // 랜덤 값 입력 디피 저장 실패
            res.status(200).send(defaultRes.successFalse(statuscode.DB_ERROR, resMessage.DB_ERROR));

        }
        else{
            let emailParam = {
                toEmail: 'dev.jun125@gmail.com',     // 수신할 이메일
            
                subject: '이웃집 닥터 변경된 비밀번호 입니다.',   // 메일 제목
            
                text: `이웃집 닥턴 비밀번호 변경 입니다.\n변경된 비밀번호를 이용하여 로그인 후 반드시 마이페이지에서 비밀변호를 변경하여 주세요!!\n변경된 비밀번호 : ` + randomString                 // 메일 내용
              };
            
            mailer.sendGmail(emailParam);
            
            
            res.status(200).send(defaultRes.successTrue(statuscode.OK, resMessage.CHANGE_PASSWORD,{randomString}));
        }

        }

    }
   
})
module.exports = router;