const http = require('../utils/http.js');

const Router = require('koa-router');

const router = new Router({ prefix: '/address' });

// 获取默认地址
router.get('/get_default', async (ctx, next) => {
	let sql = 'select `id`,`receiveName`,`receivePhone`,`receiveRegion`,`receiveDetail`,`isDefault` from `dt_address` where `isDefault` = 1 and `openid` = ?';
	let results = await http(sql, [ctx.state.openid]);
	return Promise.resolve(results[0] || null);
});

// 获取用户所有地址信息
router.get('/list', async (ctx, next) => {
	let sql = 'select `id`,`receiveName`,`receivePhone`,`receiveRegion`,`receiveDetail`,`isDefault` from `dt_address` where `openid` = ?';
	let results = await http(sql, [ctx.state.openid]);
	return Promise.resolve(results);
});

// 新增地址
router.post('/add', async (ctx, next) => {
	const { receiveName, receivePhone, receiveRegion, receiveDetail, isDefault } = ctx.request.body;
	const sql = 'insert into `dt_address`(`openid`,`receiveName`,`receivePhone`,`receiveRegion`,`receiveDetail`,`isDefault`) values (?,?,?,?,?,?)';
	const results = await http(sql, [ctx.state.openid, receiveName, receivePhone, receiveRegion, receiveDetail, isDefault]);
	if(results.affectedRows === 1) { return Promise.resolve(results.insertId); }
	else { return Promise.reject('地址新增失败...'); }
});

// 修改地址
router.post('/update', async (ctx, next) => {
	const { id, receiveName, receivePhone, receiveRegion, receiveDetail, isDefault } = ctx.request.body;
	const sql = 'update `dt_address` set `receiveName` = ?,`receivePhone` = ?,`receiveRegion` = ?,`receiveDetail` = ?,`isDefault` = ? where `id` = ?';
	const results = await http(sql, [receiveName, receivePhone, receiveRegion, receiveDetail, isDefault, id]);
	if(results.affectedRows === 1) { return Promise.resolve(); }
	else { return Promise.reject('地址修改失败...'); }
});

// 设置默认地址
router.get('/set_default/:id', async (ctx, next) => {
	let id = parseInt(ctx.params.id);
	let sql = 'call p_setDefaultAddress(?,?)';
	await http(sql, [ctx.state.openid, id]);
	// 执行多条SQL语句
	// let sql = 'update `dt_address` set `isDefault` = 0 where `openid` = ?;update `dt_address` set `isDefault` = 1 where `id` = ?;'
	// await http(sql, [ctx.state.openid, id], { multipleStatements: true })
	return Promise.resolve();
});

// 删除地址
router.get('/remove/:id', async (ctx, next) => {
	let id = parseInt(ctx.params.id);
	let sql = 'call p_removeAddress(?)';
	let results = await http(sql, [id]);
	if(results[0][0].result === '') { return Promise.resolve(); }
	else { return Promise.reject(results[0][0].result); }
});

module.exports = router.routes();