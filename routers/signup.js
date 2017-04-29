var routers=require('express').Router();
var fs=require('fs');
var path=require('path');
var sha1=require('sha1');



var checkNotLogin=require('../middlewares/check').checkNotLogin;
var UserModel=require('../models/users');

//signup page
routers.get('/',checkNotLogin,(req,res,next)=>{
	res.render('signup');
})
//singup
routers.post('/',checkNotLogin,(req,res,next)=>{
	var name=req.fields.name;
	var gender=req.fields.gender;
	var bio=req.fields.bio;
	var avatar=req.fields.avatar.path.split(path.sep).pop();
	var password=sha1(req.fields.password);
	var repassword=req.fields.repassword;

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