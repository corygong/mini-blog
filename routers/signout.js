var routers=require('express').Router();
var checkLogin=require('../middlewares/check').checkLogin;
routers.get('/',checkLogin,(req,res,next)=>{
	req.session.user=null;
	req.flash('success','login out succeed');
	res.redirect('/posts');
});

module.exports=routers;