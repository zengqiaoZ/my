var express = require('express');
var router = express.Router();
const querySql = require('../db/index')



//获取列表信息 并模糊查询
router.post('/gys', async (req, res, next) => {
	try {
		let {
			page,
			size,
			searchMap
		} = req.body
		let {
			name,
			linkman,
			mobile
		} = searchMap
		let name1 = "%" + name + "%"
		let linkman1 = "%" + linkman + "%"
		let mobile1 = "%" + mobile + "%"
		let start = (page - 1) * 10
		//获取会员列表信息
		let hyxxsql =
			'select * from gys where name like ?  and linkman like ? and mobile like ? limit ?,?'
		let hyxx = await querySql(hyxxsql, [name1, linkman1, mobile1, start, size])
		//获取总数
		let sql2 = 'select count(*) as total from gys'
		let result2 = await querySql(sql2)
		res.send({
			code: 0,
			msg: '获取成功',
			total: result2[0].total,
			rows: hyxx
		})
	} catch (e) {
		console.log(e)
		next(e)
	}
});

//信息新增
router.post('/add', async (req, res, next) => {
	try {
		console.log(req.body)
		let {
			name,
			linkman,
			mobile,
			remark
		} = req.body
		
		let addhyxxsql =
			'INSERT INTO gys( name, linkman, mobile, remark) VALUES (?, ?, ?, ?)'
		let addhyxx = await querySql(addhyxxsql, [name, linkman, mobile, remark])
		res.send({
			code: 0,
			message: '新增成功',
			flag: true
		})
	} catch (e) {
		console.log(e)
		next(e)
	}
});
//删除信息
router.post('/delete', async (req, res, next) => {
	// console.log("111"+req.body)
	let {
		id
	} = req.body
	console.log(req.body)
	console.log(id)
	try {
		let sql = 'delete from gys where id = ? '
		let result = await querySql(sql, [id])
		res.send({
			code: 0,
			message: '删除成功',
			flag: true,
			data: null
		})
	} catch (e) {
		console.log(e)
		next(e)
	}
});

//修改信息
router.put('/update', async (req, res, next) => {

	let {
		id,
		name,
		linkman,
		mobile,
		remark
	} = req.body
	try {
		let sql = 'update gys set name = ?,linkman = ?,mobile = ? ,remark = ? where id = ? '
		let result = await querySql(sql, [name, linkman, mobile, remark,id])
		res.send({
			code: 0,			
			message: '更新成功',
			flag:true,
			data: null
		})
	} catch (e) {
		console.log(e)
		next(e)
	}
});





module.exports = router;
