// 导入路由对象构造函数
const Router = require('koa-router');
const http = require('../utils/http.js');

// 创建路由对象
const router = new Router({ prefix: '/cart' });

// 自定义配置路由对象
// 获取购物车所有商品
router.post('/list', async (ctx, next) => {
	const sql = 'select T1.`id`,T1.`pid`,T1.`count`,T2.`name`,T2.`avatar`,T2.`price`,T2.`brief` from (select * from `dt_cart` where `openid` = ?) T1 inner join `dt_product` T2 on T1.pid = T2.id;';
	let results = await http(sql, [ctx.state.openid]);
	return Promise.resolve(results);
});

// 获取购物车中的总商品数量
router.get('/total', async (ctx, next) => {
	let sql = 'select sum(`count`) as total from `dt_cart` where `openid` = ?';
	let results = await http(sql, [ctx.state.openid]);
	return Promise.resolve(results[0].total || 0);
});

// 添加一件商品
router.post('/add', async (ctx, next) => {
	let { pid, count, price } = ctx.request.body;
	let sql = 'call p_addProduct(?,?,?,?);';
	let results = await http(sql, [ctx.state.openid, pid, count, price]);
	if(results[0][0].result) {
		return Promise.reject(results[0][0].result);
	} else {
		return Promise.resolve();
	}
});

// 增加商品数量
router.post('/increase/:id', async (ctx, next) => {
	let id = parseInt(ctx.params.id);
	let sql = 'update `dt_cart` set `count` = `count` + 1 where `id` = ?';
	await http(sql, [id]);
	return Promise.resolve();
});

// 减少商品数量
router.post('/decrease/:id', async (ctx, next) => {
	let id = parseInt(ctx.params.id);
	let sql = 'update `dt_cart` set `count` = `count` - 1 where `id` = ?';
	await http(sql, [id]);
	return Promise.resolve();
});

// 批量删除商品
router.post('/remove', async (ctx, next) => {
	let { ids } = ctx.request.body;
	let sql = 'delete from `dt_cart` where `id` in (?)';
	await http(sql, [ids]);
	return Promise.resolve();
});

// 获取指定购物id的相关信息
router.post('/list_ids', async (ctx, next) => {
	let { ids } = ctx.request.body;
	let sql = 'select T1.id,T1.pid,T1.count,T2.name,T2.avatar,T2.price,T2.brief from (select * from `dt_cart` where `id` in (?)) T1 inner join `dt_product` T2 on T1.pid = T2.id;';
	const results = await http(sql, [ ids ]);
	return Promise.resolve(results);
});

// 导出路由对象
module.exports = router.routes();

// 执行存储过程一定返回数组