var routers=require('express').Router();
var checkNotLogin=require('./middlewares/check').checkNotLogin;
routers.get('/',checkLogin,(req,res,next)=>{
	res.send(req.flash());
})

module.exports=routers;