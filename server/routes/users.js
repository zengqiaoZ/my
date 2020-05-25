var express = require('express');
var router = express.Router();
const querySql = require('../db/index')
const {PWD_SALT,PRIVATE_KEY,EXPIRESD} = require('../utils/constant')
const {md5,upload} = require('../utils/index')
const jwt = require('jsonwebtoken')
/* 注册接口 */
router.post('/register', async(req, res, next) => {
	console.log(req.body)
  let {username,password,nickname} = req.body
  try {
	 //判断是否已经注册过
    let user = await querySql('select * from user where username = ?',[username])
    if(!user || user.length === 0){
      password = md5(`${password}${PWD_SALT}`)
      await querySql('insert into user(username,password,nickname) value(?,?,?)',[username,password,nickname])
      res.send({code:0,message:'注册成功'})
    }else{
      res.send({code:-1,message:'该账号已注册'})
    }
  }catch(e){
    console.log(e)
    next(e)
  } 
});

// 登录接口
router.post('/login',async(req,res,next) => {
	console.log(req.body)
  let {username,password,nickname} = req.body
  try {
    let user = await querySql('select * from user where username = ?',[username])
      if(!user || user.length === 0){
        res.send({code:0,message:'该账号不存在',flag:false})
      }else{
        password = md5(`${password}${PWD_SALT}`)
        let result = await querySql('select * from user where username = ? and password = ?',[username,password])
        if(!result || result.length === 0){
          res.send({code:0,message:'账号或者密码不正确',flag:false})
        }else{
          let token = jwt.sign({username},PRIVATE_KEY,{expiresIn:EXPIRESD})
          res.send({code:0,message:'登录成功',token:token,flag:true,data:{"token":username}})
        }      
      }
  }catch(e){
    console.log(e)
    next(e)
  } 
})

//获取用户信息接口
router.post('/info',async(req,res,next) => {
	console.log("获取用户信息成功")
	console.log(req.body)
  let {username} = req.body
  try {
    let userinfo = await querySql('select username,nickname,head_img from user where username = ?',[username])
    res.send({code:0,message:'成功',data:userinfo[0],flag:true})
  }catch(e){
    console.log(e)
    next(e)
  } 
})

//用户信息更新接口
router.post('/updateUser',async(req,res,next) => {
  let {nickname,head_img} = req.body
  let {username} = req.user
  try {
    let result = await querySql('update user set nickname = ?,head_img = ? where username = ?',[nickname,head_img,username])
    console.log(result)
    res.send({code:0,message:'更新成功',data:null})
  }catch(e){
    console.log(e)
    next(e)
  } 
})

//校验密码
router.post('/checkpwd',async(req,res,next) => {
	// select * from user where username='"+username+"'and password='"+password+"'"
	 console.log(req.body)
  let {username,password} = req.body
 
  let password1 = md5(`${password}${PWD_SALT}`)

  try {
    let result = await querySql('select * from user where username=? and password=?',[username,password1])
    console.log(result)
	if(result.length>0){
		res.send({code:0,message:'密码正确',data:null,flag:true})
	}else{
		res.send({code:0,message:'密码错误',data:null,flag:false})
	}
    
  }catch(e){
    console.log(e)
    next(e)
  } 
})

// 修改密码

router.put('/updatepwd',async(req,res,next) => {
	// select * from user where username='"+username+"'and password='"+password+"'"
  console.log(req.body)
  let {username,password} = req.body
 
  let password1 = md5(`${password}${PWD_SALT}`)

  try {
    let result = await querySql('update user set password=? where username=?',[password1,username])
    console.log(result)
	if(result.affectedRows>0){
		res.send({code:0,message:'密码修改成功',data:null,flag:true})
	}else{
		res.send({code:0,message:'密码修改失败',data:null,flag:false})
	}
    
  }catch(e){
    console.log(e)
    next(e)
  } 
})


module.exports = router;
