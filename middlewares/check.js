module.exports={
	checkLogin:function checkLogin(req,res,next){
		if (!req.session.user) {
			req.flash('error','not login in');
			return res.redirect('/signin');
		}
		next();
	},
	checkNotLogin:function checkNotLogin(req,res,next){
		if (req.session.user) {
			req.flash('error','has logined in');
			return res.redirect('back');
		}
		next();
	}
}