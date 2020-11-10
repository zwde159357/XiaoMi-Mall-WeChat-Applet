// 导入路由对象构造函数
const Router = require('koa-router');
const http = require('../utils/http.js');

// 构造路由对象
const router = new Router({ prefix: '/category' });

// 自定义配置路由对象
router.get('/list/:fid', async (ctx, next) => {
	// 连接数据库 默认开在3306
	// 只关注199和200的情况
	// 需要知道sql语句，参数及其类型，执行结果
	let fid = parseInt(ctx.params.fid);
	let sql = 'select * from `dt_category` where `fid` = ?;';
	const results = await http(sql, [fid]);
	return Promise.resolve(results);
});

// 导出路由对象
module.exports = router.routes();