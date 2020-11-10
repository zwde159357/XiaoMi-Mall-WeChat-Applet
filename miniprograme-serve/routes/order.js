const http = require('../utils/http.js');
const Router = require('koa-router');

const router = new Router({ prefix: '/order' });

// 生成订单
router.post('/confirm', async (ctx, next) => {
	let { ids, account, addressId } = ctx.request.body;
	let sql = 'call p_orderConfirm(?,?,?,?,?)';
	let results = await http(sql, [ids.join(','), account, new Date(), ctx.state.openid, addressId]);
	return Promise.resolve(results[0][0].orderId);
});

// 获取订单总金额
router.get('/account/:id', async (ctx, next) => {
	let id = ctx.params.id;
	let sql = 'select `account` from `dt_order` where `id` = ?';
	let results = await http(sql, [id]);
	return results[0].account;
});

// 为指定订单付款
router.get('/pay/:id', async (ctx, next) => {
	let id = ctx.params.id;
	let sql = 'update `dt_order` set `pay` = 1 where `id` = ?';
	let results = await http(sql, [id]);
	return Promise.resolve(results);
});

// 获取所有商品订单
router.get('/list_all', async (ctx, next) => {
	let openid = ctx.state.openid;
	let sql = 'select * from `order_product_address` where `uOpenid` = ?';
	let results = await http(sql, [openid]);
	return Promise.resolve(resultFormat(results));
});

router.get('/list/:flag', async (ctx, next) => {
	let flag = ctx.params.flag;
	let sql = 'select * from `order_product_address` where `uOpenid` = ?';
	let results = await http(sql, [openid]);
	return Promise.resolve(resultFormat(results));
});

// 删除某一订单
router.get('/remove/:id', async (ctx, next) => {
	let id = ctx.params.id;
	let sql = "call p_removeOrder(?);";
	let results = await http(sql, [id]);
	return Promise.resolve();
});

// 根据订单编号获取订单详细信息
router.get('/model/:id', async (ctx, next) => {
	const order_id = ctx.params.id;
	const sql = "select * from `v-myview` where `order_id` = ?";
	const results = await http(sql, [order_id]);
	return Promise.resolve(resultFormat(results[0]));
});

// 辅助函数：对结果进行格式化，以便前台使用
function resultFormat(data) {
	var result = [];
	data.forEach(function(item) {
		var i = result.findIndex(item2 => item2.orderId === item.orderId);
		if(i === -1) {
			result.push({
				orderId: item.orderId,
				account: item.account,
				orderTime: item.orderTime,
				pay: item.pay,
				addressId: item.addressId,
				receiveName: item.receiveName,
				receivePhone: item.receivePhone,
				receiveRegion: item.receiveRegion,
				receiveDetail: item.receiveDetail,
				details: []
			});
		} 
		result[i === -1 ? result.length - 1 : i].details.push({
			id: item.id,
			count: item.count,
			name: item.name,
			remark: item.remark,
			avatar: item.avatar,
			price: item.price
		});
	});
	return result;
}

module.exports = router.routes();