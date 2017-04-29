var router=require('express').Router();

var checkLogin=require('../middlewares/check').checkLogin;

var method={
	checkedPostMethod:(me)=>{
		routers.post(me,checkNotLogin,(req,res,next)=>{
			res.send(req.flash());
		})
	},
	checkedGetMethod:(me)=>{
		routers.get(me,checkNotLogin,(req,res,next)=>{
			res.send(req.flash());
		})
	},
	uncheckedPostMethod:(me)=>{
		routers.post(me,(req,res,next)=>{
			res.send(req.flash());
		})
	},
	uncheckedGetMethod:(me)=>{
		routers.get(me,(req,res,next)=>{
			res.send(req.flash());
		})
	}

};


module.exports=method;