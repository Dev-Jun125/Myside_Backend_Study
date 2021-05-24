var express = require('express');
var router = express.Router();

const db = require('../module/pool');
//전체 글 보여주기
/* GET List Page. */
router.get('/search', async (req, res) => {
    const getBoard = "SELECT * FROM board WHERE boardIdx <= 100000";
    const getResult = await db.queryParam_None(getBoard);

    console.log(getResult);
    if (!getResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        res.status(200).send(getResult);
    }
});
// 글 하나씩 보여주기, 글 좋아요, 
router.get('/search/detail/:boardIdx/:user_id', async (req, res) => {
    

    var likestatus = 0;
    console.log(req.params);
    console.log(req.params.boardIdx);

    const getBoard = "SELECT * FROM board where boardIdx = ?";
    const getBoardResult = await db.queryParam_Parse(getBoard, req.params.boardIdx);
    const getLike = "SELECT * FROM likelist where boardIdx = ? AND user_id = ?";
    const getLikeResult = await db.queryParam_Parse(getLike, [req.params.boardIdx, req.params.user_id]);
    if(!getLikeResult[0]){
        likestatus=0;
    }
    else{
        likestatus=1;
    }
    
    console.log(getBoardResult);
    console.log(getLikeResult);

    if (!getBoardResult || !getLikeResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        var resResult = {
            success : 0,
            message : "",
            data : {
                title : "",
                content : "",
                like_sum : "",
                status : ""
            }
        }
        if(likestatus==0){
            resResult.success = 0;
            resResult.message = "좋아요 X";
            resResult.data.title = getBoardResult[0].title;
            resResult.data.content = getBoardResult[0].content;
            resResult.data.like_sum = getBoardResult[0].like_sum;
            resResult.data.status = likestatus;
            res.status(200).send(resResult);
    }
        else {
            resResult.success = 1;
            resResult.message = "좋아요";
            resResult.data.title = getBoardResult[0].title;
            resResult.data.content = getBoardResult[0].content;
            resResult.data.like_sum = getBoardResult[0].like_sum;
            resResult.data.status = likestatus;
            res.status(200).send(resResult);
        }
    }
});

//글 쓰기
router.post('/input', async (req, res) => {
    
    console.log(req.body);
    

    const getBoard = "INSERT INTO board(title, content, user_id, date) Values(?, ?, ?, now())";
    const getResult = await db.queryParam_Parse(getBoard, [req.body.title, req.body.content, req.body.user_id]);

    console.log(getResult);
    if (!getResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        res.status(200).send("성공했습니다.");
    }
});
//글 내용 수정
router.post('/update/:boardIdx', async (req, res) => {
    console.log(req.body);

    const updateBoard = "UPDATE board SET content = ?, date =now() WHERE boardIdx = ?";
    const updateResult = await db.queryParam_Parse(updateBoard, [req.body.content, req.params.boardIdx]);
    console.log(updateResult);
    if (!updateResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        res.status(200).send("성공했습니다.");
    }
});

//글 찾기
router.get('/find/:findword', async(req, res) => {
    
    console.log(req.body);
     
    const findBoard = "SELECT * FROM board WHERE title LIKE ?";
    const findResult = await db.queryParam_Parse(findBoard, [req.params.findword]);
    console.log(findResult);
    if (!findResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        res.status(200).send(findResult);
    }
});

//글 삭제 인척 하는 글 수정
router.post('/delete/:boardIdx', async(req, res) => {
    const deleteBoard = "UPDATE board SET boardIdx = boardIdx + 100000, date = now() WHERE boardIdx = ?";
    const deleteResult = await db.queryParam_Parse(deleteBoard, [req.params.boardIdx, req.params.boardIdx]);
    if (!deleteResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        res.status(200).send(deleteResult);
    }
});

router.post('/search/detail/:boardIdx', async (req, res) => {
    
    console.log(req.body);
    console.log(req.body.boardIdx);

    const getBoard = "INSERT INTO comment (boardIdx, user_id, content) VALUES(?, ?, ?)";
    const getResult = await db.queryParam_Parse(getBoard, [req.body.boardIdx, req.body.user_id, req.body.content]);

    console.log(getResult);
    if (!getResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        res.status(200).send(getResult);
    }
});

router.get('/search/detail/:boardIdx/comment', async (req, res) => {
    const getcomment = "SELECT user_id, content FROM comment WHERE boardIdx = ?";
    const resultcomment = await db.queryParam_Parse(getcomment, req.params.boardIdx);
    console.log(resultcomment);
    var resResult = {
        success : 0,
        message : "",
        comment : ""
    }
    if (!resultcomment) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        if(!resultcomment[0]){
            resResult.success = 0;
            resResult.message = "작성된 댓글이 없습니다.";
            resResult.comment = resultcomment;
            res.status(200).send(resResult);
        }
        else {
            resResult.success = 1; 
            resResult.message = "댓글";
            resResult.comment = resultcomment;
            res.status(200).send(resResult);
        }
    }
} )


router.post('/search/detail/:boardIdx/:user_id/likeadd', async (req, res) => {
    
    console.log(req.body);
    console.log(req.body.boardIdx);
    

    const getLike = "INSERT INTO likelist (boardIdx, user_id, date) VALUES(?, ?, now())";
    const getLikeResult = await db.queryParam_Parse(getLike, [req.body.boardIdx, req.body.user_id]);

    
    console.log(getResult);
    if (!getResult) {
        res.status(200).send("DB 오류");
    } else { //
        const getlike = "UPDATE board SET like_sum = like_sum + 1 WHERE boardIdx = ?";
        const getlikeResult = await db.queryParam_Parse(getlike, get.body.boardIdx);
        res.status(200).send(getResult);
    }
});

router.get('/search/:boardorder', async (req, res) => {
    let Query;
    if (req.params.boardorder == 1){
        Query = "SELECT * FROM board ORDER BY date DESC";

    }

    else if (req.params.boardorder == 2) {
        Query = "SELECT * FROM board ORDER BY like_sum DESC";
    }

    const getResult = await db.queryParam_None(Query);

    var resResult = {
        success : 0,
        message : "",
        data : {
            title : "",
            content : "",
            like_sum : "",
            status : ""
        }
    }
    if (!getResult) {
        
        res.status(200).send("DB오류");
        
    } else { //쿼리문이 성공했을 때
        
        res.status(200).send(getResult);
    
    }
})
//order by
module.exports = router;
/*
router.get('/search/:boardIdx/like', async(req, res), => {
    const getlike = "SELECT "
})*/
/*get = params로 
post, delete, body로*/
//SELECT로 값이 나오면 좋아요 아니면 x