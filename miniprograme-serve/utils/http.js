const mysql = require('mysql');
const dbConfig = require('../config').dbConfig;

function http(sql, params = [], conConfig = {}) {
	return new Promise((resolve, reject) => {
		// 创建连接对象
		let con = mysql.createConnection({...dbConfig, ...conConfig});
		// 调用query函数
		con.query(sql, params, (error, results) => {
			if(error) reject(error);
			else resolve(results);
			con.end();
		});
	});
}

module.exports = http;