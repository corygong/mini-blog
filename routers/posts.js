

var method = require('./abstract');

method.checkedGetMethod('/');

method.uncheckedGetMethod('/');


//发表文章

method.checkedPostMethod('/');

//已发表文章
method.checkedGetMethod('/create');
/*router.get('/create',checkLogin,(req,res,next)=>{
	res.send(req.flush());
});*/

//
method.uncheckedGetMethod('/:postId');
/*router.get('/:postId',(req,res,next)=>{
	res.send(req.flush());
});*/

router.get('/:postId',(req,res,next)=>{
	res.send(req.flush());
});

router.get('/:postId',(req,res,next)=>{
	res.send(req.flush());
});

module.exports=method;