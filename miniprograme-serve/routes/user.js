const http = require('../utils/http.js');
const Router = require('koa-router');
const querystring = require('querystring');
const request = require('request');
const session = require('../utils/session.js');
const router = new Router({ prefix: '/user' });
const file = require('../utils/file.js');
const path = require('path');

router.get('/login/:code', (ctx, next) => {
	const code = ctx.params.code;
	// 向微信服务器发送get请求拿code去换open_id和session_key
	let url = 'https://api.weixin.qq.com/sns/jscode2session?';
	let params = {
		appid: "wx7a776c3d084a0b8a",
		secret: "4ff7cd1ad93c112e9a55478f10b9e406",
		js_code: code,
		grant_type: "authorization_code"
	};
	let urlParams = querystring.stringify(params);
	return new Promise((resolve, reject) => {
		request.get({ url: url + urlParams }, async function(error, response, body) {
			if(error) { reject(error); }
			else {
				const { session_key, openid } = JSON.parse(body);
				const str_3rd_session = session.set([openid, session_key]);
				await http('call p_login(?);', [openid]);
				resolve(str_3rd_session);
			}
		})
	});
});

// 修改个人头像
router.post('/update', async (ctx, next) => {
	// 将上传来的文件从临时目录保存到真实目录中去
	const openid = ctx.state.openid;
	const { nick_name, avatar, avatar2 } = ctx.request.body;
	if(avatar !== avatar2) {
		// 可以获取前面的body中间件，获取上传来的文件路径
		let fromPath = ctx.request.files.file.path;
		var fileName = fromPath.slice(fromPath.lastIndexOf('\\') + 1);
		let toPath = path.join(__dirname, '../public/images/user/', fileName);
		await file.copy(fromPath, toPath);					// 把文件从临时目录拷贝到最终目录
		await file.unlink(fromPath);		                // 把临时目录中的文件删除
		// 如果用户原来有头像，把原来的头像从文件夹中删除
		if(avatar) await file.unlink(path.join(__dirname, '../public', avatar));
	}
	const sql = 'update `dt_user` set `avatar` = ?, `nick_name` = ? where `openid` = ?';
	await http(sql, ['/images/user/' + fileName, nick_name, openid]);
	return Promise.resolve();
});

// 获取个人信息
router.get('/user_info', async (ctx, next) => {
	let openid = ctx.state.openid;
	let sql = 'select `nick_name`, `avatar` from `dt_user` where `openid` = ?';
	let results = await http(sql, [openid]);
	return Promise.resolve(results[0]);
});

// 修改昵称
router.get('/update_name/:name', async (ctx, next) => {
	let openid = ctx.state.openid;
	let nick_name = ctx.params.name;
	let sql = 'update `dt_user` set `nick_name` = ? where `openid` = ?';
	let results = await http(sql, [nick_name, openid]);
	return Promise.resolve();
});

module.exports = router.routes();