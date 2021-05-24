var express = require('express');
var router = express.Router();
const defaultRes = require("../module/utils/utils");
const statusCode = require("../module/utils/statusCode");
const resMessage = require("../module/utils/responseMessage");

const db = require('../module/pool');

/* GET users listing. */

router.post('/singup', async(req, res) =>{
  const insertUsers = "INSERT INTO User_TB(user_email, user_name, user_phone, user_password, user_patient, user_nickname, user_censor, user_censor_etc, user_status, user_level) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const insertUsersResult = await db.queryParam_Parse(insertUsers, [req.body.user_email, req.body.user_name, req.body.user_phone, req.body.user_password, req.body.user_patient, req.body.user_nickname, req.body.user_censor, req.body.user_censor_etc, req.body.user_status, req.body.user_level]);
  if (!insertUsersResult) {
    res.status(200).send("DB오류");
    
} else { //쿼리문이 성공했을 때
    res.status(200).send("성공했습니다.");

}
});

router.post('/emailfind', async(req, res) => {
  const getUsersEmail = "SELECT user_email FROM User_TB WHERE user_name = ? AND user_phone = ?";
  const resultUsersEmail = await db.queryParam_Parse(getUsersEmail, [req.body.user_name, req.body.user_phone]);
  console.log(resultUsersEmail);

  var resResult = {
      success : 0,
      message : "",
      email : ""
  }

  if (!resultUsersEmail) {
    res.status(200).send("DB오류");
    
} else { //
    if(!resultUsersEmail[0]){
      resResult.success = 0;
      resResult.message = "해당 이름과 번호에 대한 이메일이 존재하지 않습니다";
      resResult.email = resultUsersEmail[0].user_email;
      res.status(200).send(resultUsersEmail);
        
    }
    else{
      resResult.success = 1; 
      resResult.message = "이메일 찾기 성공";
      resResult.email = [0].user_email;
      res.status(200).send();

    }
}  
  
});
router.post('./passwordfind', async (req, res) => {
  const getUserPassword = "SELECT user_password FROM User_TB WHERE user_email = ? AND user_phone = ?";
  const resultUserPassword = await db.queryParam_Parse(getUserPassword,[req.body.user_email, req.body.user_phone])
})




module.exports = router;

