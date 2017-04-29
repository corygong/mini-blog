var routers=require('express').Router();
var checkNotLogin=require('./middlewares/check').checkNotLogin;
routers.get('/',checkNotLogin,(req,res,next)=>{
	res.send(req.flash());
})
routers.post('/'checkNotLogin,(req,res,next)=>{
	res.send(req.flash());
})
module.exports=routers;