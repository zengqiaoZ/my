var express = require('express');
var router = express.Router();
const querySql = require('../db/index')

//获取各个数量
router.post('/getInfodata', async (req, res, next) => {
	try {
			
		let sql = 'select count(*) as result from hyxx union select count(*) as gys from gys union select count(*) as sp from sp union select count(*) as yg from yg'
		let result = await querySql(sql)
		res.send({
			code: 0,
			msg: '获取成功',
			total: result
		})
	} catch (e) {
		console.log(e)
		next(e)
	}
});

module.exports = router;
