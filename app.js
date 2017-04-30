var path=require('path');
var express=require('express');
var session=require('express-session');
var mongoStore=require('connect-mongo')(session);
var flash=require('connect-flash');
var config=require('config-lite')(__dirname);
var routers=require('./routers');
var pkg=require('./package');
var winston=require('winston');
var expressWinston=require('express-winston');




var app=express();
/*var indexRouter=require('./routers/index');
var userRouter=require('./routers/users');*/


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    name:config.session.key,
    secret:config.session.secret,
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge:config.session.maxAge
    },
    store:new mongoStore({
        url:config.mongodb
    })
}))

app.use(flash());

//表单和文件上传
app.use(require('express-formidable')({
    uploadDir:path.join(__dirname,'public/img'),
    keepExtensions:true
}));

//模板全局常量

app.locals.blog={
    title:pkg.name,
    description:pkg.description
};

app.use((req,res,next)=>{
    res.locals.user=req.session.user;
    res.locals.success=req.flash('success').toString();
    res.locals.error=req.flash('error').toString();
    next();
})
//正常请求日志
app.use(expressWinston.logger({
    transports:[
        new (winston.transports.Console)({
            json:true,
            colorize:true
        }),
        new winston.transports.File({
            filename:'logs/success.log'
        })
    ]
}));
//错误请求日志
app.use(expressWinston.errorLogger({
    transports:[
        new winston.transports.Console({
            json:true,
            colorize:true
        }),
        new winston.transports.File({
            filename:'logs/error.log'
        })
    ]
}));
app.use((err,req,res,next)=>{
    res.render('error',{
        error:err
    });
});

routers(app);
if (module.parent) {
    module.exports=app;
}else{
    app.listen(config.port,()=>{
        console.log(`${pkg.name} listening on port ${config.port}`);
    });
}

