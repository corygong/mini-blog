var router=require('express').Router();
var PostModel=require('../models/posts');
var CommentModel=require('../models/comments');
var checkLogin=require('../middlewares/check').checkLogin;

//获取所有的posts
router.get('/',(req,res,next)=>{
	var author=req.query.author;
	PostModel.getPosts(author).then((posts)=>{
		res.render('posts',{
			posts:posts
		});
	}).catch(next);
})


//发表文章页
router.get('/create',checkLogin,(req,res,next)=>{
	res.render('create');
})
//publish one post
router.post('/',checkLogin,(req,res,next)=>{
	var post={
		authorId:req.session.user._id,
		title:req.fields.title,
		content:req.fields.content,
		pv:0
	};
	PostModel.create(post).then((result)=>{
		post=result.ops[0];
		req.flash('success','published success');
		res.redirect(`/posts/${post._id}`)
	}).catch(next);
})


//根据postid查询文章页
router.get('/:postId',(req,res,next)=>{
	var postId=req.params.postId;
	Promise.all([
		PostModel.getPostById(postId),
		CommentModel.getComments(postId),
		PostModel.incPv(postId)
	]).then((result)=>{
		res.render('post',{
			post:result[0],
			comments:result[1]
		});

	}).catch(next);
})

//更新文章页
router.get('/:postId/edit',checkLogin,(req,res,next)=>{
	var postId=req.params.postId;
	var authorId=req.session.user._id;
	PostModel.getRawPostById(postId).then((post)=>{
		if (!post) {
			throw new Error('the post is not exist');
		};
		if (authorId.toString()!==post.author._id.toString()) {
			throw new Error('you have no right to see the post');
		};
		res.render('edit',{
			post:post
		});
	}).catch(next);
})

//update one post
router.post('/:postId/edit',checkLogin,(req,res,next)=>{
	var postId=req.params.postId;
	var authorId=req.session.user._id;
	var title=req.fields.title;
	var content=req.fields.content;
	PostModel.updatePostById(postId,authorId,{title:title,content:content}).then(()=>{
		req.flash('success','edit the post succeed');
		res.redirect(`/posts/${postId}`);
	}).catch(next);

})
//remove  one post
router.get('/:postId/remove',checkLogin,(req,res,next)=>{
	var postId=req.params.postId;
	var authorId=req.session.user._id;
	PostModel.delPostById(postId,authorId).then(()=>{
		req.flash('success','delete the post succeed');
		res.redirect('/posts');
	}).catch(next);

})

//create one comment
router.post('/:postId/comment',checkLogin,(req,res,next)=>{
	var comment={
		authorId:req.session.user._id,
		postId:req.params.postId,
		content:req.fields.content
	};
	CommentModel.create(comment).then(()=>{

		req.flash('success','create comment succeed');
		res.redirect('back');
	}).catch(next);
})

//delete one comment
router.get('/:postId/comment/:commentId/remove',checkLogin,(req,res,next)=>{
	var commentId=req.params.commentId;
	var authorId=req.session.user._id;
	CommentModel.delCommentById(commentId,authorId).then(()=>{
		req.flash('success','delete the comment succeed');
		res.redirect('back');
	}).catch(next);
})


module.exports=router;