const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const body = require('koa-body');
const routerMiddleWares = require('./routes');
const httpResult = require('./config').httpResult;
const cors = require('koa2-cors');
const session = require('./utils/session.js');

// new Koa创建一个服务器对象
const server = new Koa();

// use注册的函数就叫做中间件（middleWare）

// 支持跨域
server.use(cors({
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

server.use(async (ctx, next) => {
	console.log(ctx.url);	// 输出请求的路径
	await next();
});

// 处理客户端的静态资源请求(html/js/css/图片/音频/视屏)
server.use(serve(path.join(__dirname, 'public')));

// 动态数据请求
// 对客户端传来的数据进行解析处理，便于对客户端进行使用。
server.use(body({
    multipart: true,	// 接收上传资源的请求
    formidable: {
        keepExtensions: true,
        uploadDir: path.join(__dirname, "public/tmp")
    },
    onError: (error, ctx) => { console.log(error); }
}));

// 统一返回服务器响应结果的中间件
server.use(async (ctx, next) => {
	return next()				// 先让后面的中间件执行，then，catch托底
				.then(data => ctx.body = httpResult.success(data))
				.catch(error => {
					if(error === '401')
						ctx.body = httpResult.untoken();
					else if(error === '404')
						ctx.body = httpResult.notFound();
					else if(typeof error === 'string')
						ctx.body = httpResult.fail(error);
					else{
						console.log(error);
						ctx.body = httpResult.error(error.message);
					}
				});
});

// 登录验证
server.use(async (ctx,next) => {
	// if(ctx.url.indexOf('/user/login') !== -1) { return next(); }
	const regArr = [/^\/category/,/^\/product/,/^\/user\/login/];
	let isNext = regArr.some(reg => reg.test(ctx.url));
	if(isNext) { return next(); }
	else {
		// 请求头中拿authorization节点中的token值
		const str_3rd_session = ctx.headers['authorization'];
		if(session.has(str_3rd_session)) {
			const [openid, session_key] = session.get(str_3rd_session);
			ctx.state.openid = openid;
			ctx.state.session_key = session_key;
			return next();
		}
		else
			return Promise.reject("401");
	}
});

// 动态数据路由处理
routerMiddleWares.forEach(router => server.use(router));

// 如果到这还没有命中，404错误
server.use(async (ctx, next) => {
	return Promise.reject("404");
});


// server.use((ctx, next) => {
// 	// Content-Type为x-www-form-urlencode
// 	// console.log(ctx.request.query);
// 	// Content-Type: application/json
// 	console.log(ctx.request.body);
// 	ctx.body = 'hello';
// });


// 让server对象listen监听指定的端口，开启服务器
server.listen(1314, () => console.log('server is running at port 1314')); // 第二个参数是监听成功的回调函数

// await Promise.rejected() 失败的结果会报错，可以用try/catch捕获