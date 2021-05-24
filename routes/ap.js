function getAllboard(callback){ 
    connection.query(`SELECT * FROM board`, (err, rows, fields) => { 
        if(err) throw err; 
        callback(rows); }); 
    } 
    module.exports = { 
        getAllboard
    }