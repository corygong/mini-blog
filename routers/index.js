/*var express=require('express');
var router=express.Router();
router.get('/',(req,res)=>{
	//res.send("hello,eeee");
	res.redirect('/posts');
});*/

module.exports = function(app){
	app.get('/',(req,res)=>{
		res.redirect('/posts');
	});
	//注册
	app.use('/signup',require('./signup'));
	//登录
	app.use('/signin',require('./signin'));
	//登出
	app.use('/signout',require('./signout'));
	//文章的操作
	app.use('/posts',require('./posts'));
	//404
	app.use((req,res)=>{
		if (!res.headersSent) {
			res.status(404).render('404');
		}
	});
};
