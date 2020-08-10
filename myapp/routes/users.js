const express = require('express');
const crypto = require('crypto');
const mysql = require('mysql');
const con = mysql.createConnection({
  host     : '15.164.216.145',
  user     : 'root',
  password : 'isabel716',
  database : 'lanstudy'
});
const router = express.Router();
con.connect();

const SECRET_HASH = '볼빨간사춘기';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});
router.get('/login', function(req, res, next) {
  res.render('users-login');
});
router.get('/register',function(req,res,next){
  res.render('users-register');
});
router.get('/logout',function(req,res,next){
  console.log(req.session.username,'logout');
  req.session = null;
  res.redirect('/');
});

router.post('/login/query',function(req,res,next){
  if(req.session.username === undefined){
    res.json({
      login:false
    });
  }else{
    res.json({
      login:true,
      username:req.session.username
    });
  }
});
router.post('/login/confirm',function(req,res,next){
  //해시 생성
  const hash = crypto.createHmac('sha256', SECRET_HASH)
    .update(req.body.password)
    .digest('hex');
  //로그인 정보 확인
  con.query('SELECT password FROM auth WHERE username = ?',[req.body.username],
  function(error,results){
    if(results==undefined){
      //로그인 실패
      res.json({
        login:false,
        username:req.body.username
      });
    }
    else{
      const password = results[0].password;
      if(password===hash){
        //로그인 성공
        req.session.username = req.body.username;
        console.log(req.body.username,'login');
        res.json({
          login:true,
          username:req.body.username
        });
      }
      else{
        //로그인 실패
        res.json({
          login:false,
          username:req.body.username
        });
      }
    }
  });
});

router.post('/register/duplicate',function(req,res,next){
  con.query('SELECT * FROM auth WHERE username = ?',[req.body.username],
  function(error, results){
    if(error){
      console.log(error);
    }
    console.log(results);
    if(results.length === 0){
      res.json({
        duplicated:false,
        username:req.body.username
      });
    }
    else{
      res.json({
        duplicated:true,
        username:req.body.username
      });
    }
  });
});

router.post('/register/confirm',function(req,res,next){
  //해시 생성
  const hash = crypto.createHmac('sha256', SECRET_HASH)
    .update(req.body.password)
    .digest('hex');
  //데이터베이스 서버에 정보 전송
  con.query('INSERT INTO auth (username,password) VALUES (?,?)',[req.body.username, hash],
  function (error, results) {
    if(error){
      console.log(error);
      res.json({
        registered:false,
        username:req.body.username
      });
    }
    else{
      res.json({
        registered:true,
        username:req.body.username
      });
    }
  }); 
});
module.exports = router;
