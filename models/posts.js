var marked=require('marked');
var Post=require('../lib/mongo').Post;
var CommentModel=require('./comments');

Post.plugin('addCommentsCount',{
	afterFind:(posts)=>{
		return Promise.all(posts.map((post)=>{
			return CommentModel.getCommentsCount(post._id).then(function(commentsCount){
				post.commentsCount=commentsCount;
				return post;
			});
		}))
	},
	afterFindOne:(post)=>{
		if (post) {
			return CommentModel.getCommentsCount(post._id).then((count)=>{
				post.commentsCount=count;
				return post;
			})
		};
		return post;
	}
});
Post.plugin('content2Html',{
	afterFind : (posts)=>{
		return posts.map(function(post){
			post.content=marked(post.content);
			return post;
		});
	},
	afterFindOne:(post)=>{
		if (post) {
			post.content=marked(post.content);
		}
		return post;
	}
})

module.exports={
	create:function create (post) {
		return Post.create(post).exec();
	},
	getPostById:function getPostById(){
		return Post
			.findOne({_id:postId})
			.populate({path:'author',model:'User'})
			.addCreatedAt()
			.addCommentsCount()
			.content2Html()
			.exec();
	},
	getPosts:function getPosts(author){
		let query={};
		query.author=author;
		return Post
			.find(query)
			.populate({path:'author',model:'User'})
			.sort({_id:-1})
			.addCreatedAt()
			.addCommentsCount()
			.content2Html()
			.exec();
	},
	incPv:function incPv(postId){
		return Post
			.update({_id:postId},{$inc:{pv:1}})
			.exec();
	},
	getRawPostById:function getRawPostById(){

	},
	updatePostById:function updatePostById(){

	},
	delPostById:function delPostById(){

	}
}