const express = require('express');
const mysql = require('mysql');
const con = mysql.createConnection({
  host     : '15.164.216.145',
  user     : 'root',
  password : 'isabel716',
  database : 'lanstudy'
});
const router = express.Router();
con.connect();

router.get('/',function(req,res,next){
    res.render('chat');
});

router.post('/connect',function(req,res,next){
  con.query('SELECT MAX(id) FROM chat',
  function(error,results){
    res.json({
      id: results[0]['MAX(id)']
    });
  });
});
router.post('/update',function(req,res,next){
  con.query('select * from chat where id > ? and channel = ?',
  [req.body.id,req.body.channel],
  function(error,results){
    if(error){
      console.log(error);
      res.json({
        update: false
      });
    }else{
      res.json({
        update: true,
        chat:results
      });
    }
  });
});
router.post('/submit',function(req,res,next){
  const userInfo = req.session.username || 'anoymous';
  console.log(userInfo)

  con.query('INSERT INTO chat (channel,username,content,time) VALUES (?,?,?,now())',
  [req.body.channel,userInfo,req.body.content],
  function(error,results){
    if(error){
      console.log(error);
      res.json({
        submit: false
      });
    }else{
      res.json({
        submit: true
      });
    }
  });
});

module.exports = router;