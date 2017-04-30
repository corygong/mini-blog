
var fs=require('fs');
var path=require('path');
var sha1=require('sha1');
var routers=require('express').Router();


var checkNotLogin=require('../middlewares/check').checkNotLogin;
var UserModel=require('../models/users');

//signup page
routers.get('/',checkNotLogin,function(req,res,next){
	res.render('signup');
})
//singup
routers.post('/',checkNotLogin,function(req,res,next){
	var name=req.fields.name;
	var gender=req.fields.gender;
	var bio=req.fields.bio;

	//头像
	var avatar=req.files.avatar.path.split(path.sep).pop();
	var password=req.fields.password;
	var repassword=req.fields.repassword;


	try{
		if (!(name.length>=1 && name.length<=10)) {
			throw new Error('限制在1-10字符')
		}
		if (!(bio.length >= 1 && bio.length <= 30)) {
	      throw new Error('个人简介请限制在 1-30 个字符');
	    }
	    if (!req.files.avatar.name) {
	      throw new Error('缺少头像');
	    }
	    if (password.length < 6) {
	      throw new Error('密码至少 6 个字符');
	    }
	    if (password !== repassword) {
	      throw new Error('两次输入密码不一致');
	    }
	}catch(e){
		fs.unlink(req.files.avatar.path);
		req.flash('error',e.message);
		return res.redirect('/signup');
	}
	password=sha1(password);
	var user={
		name:name,
		gender:gender,
		bio:bio,
		avatar:avatar,
		password:password
	};

	UserModel
		.create(user)
		.then((result)=>{
			user=result.ops[0];
			delete user.password;
			req.session.user=user;
			req.flash('success','sign up succeed');
			res.redirect('/posts');
		})
		.catch((e)=>{
			fs.unlink(req.files.avatar.path);
			if (e.message.match('E11000 duplicate key')) {
				req.flash('error','duplicated name');
				return res.redirect('/signup');
			};
			next(e);
		})


})
module.exports=routers;