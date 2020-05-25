var express = require('express');
var router = express.Router();
const querySql = require('../db/index')



//获取列表信息 并模糊查询
router.post('/sp', async (req, res, next) => {
	try {
		let {
			page,
			size,
			searchMap
		} = req.body
		let {
			name,
			code,
			supplierName,
			Type
		} = searchMap
		let name1 = "%" + name + "%"
		let code1 = "%" + code + "%"
		let supplierName1 = "%" + supplierName + "%"
		let Type1 = "%" + Type + "%"
		let start = (page - 1) * 10
		//获取会员列表信息
		
		let hyxxsql =
			'select * from sp where name like ?  and code like ? and supplierName like ? and Type like ? limit ?,?'
		let hyxx = await querySql(hyxxsql, [name1, code1, supplierName1,Type1,start, size])
		//获取总数
		let sql2 = 'select count(*) as total from sp'
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
			code,
			spec,
			retailPrice,
			purchasePrice,
			storageNum,
			supplierName,
			supplierId,
			Type
		} = req.body
		
		//新增列表  每条数据必填  不然会报错？？
		let addhyxxsql =
			'INSERT INTO sp( name, code, spec, retailPrice,purchasePrice, storageNum, supplierName, supplierId,type) VALUES (?, ?, ?, ?,?,?,?,?,?)'
		let addhyxx = await querySql(addhyxxsql, [name, code, spec, retailPrice,purchasePrice, storageNum, supplierName, supplierId,Type])
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
		let sql = 'delete from sp where id = ? '
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
		code,
		spec,
		retailPrice,
		purchasePrice,
		storageNum,
		supplierName,
		supplierId,
		Type
	} = req.body
	try {
		let sql = 'update sp set name = ?,code = ?,spec = ? ,retailPrice = ?,purchasePrice = ?,storageNum = ?,supplierName = ?, supplierId = ? , Type = ? where id = ? '
		let result = await querySql(sql, [name, code, spec, retailPrice,purchasePrice, storageNum, supplierName, supplierId,Type,id])
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

router.post('/goodstj', async (req, res, next) => {
	try {
		
		//统计各类商品数量
		let sql2 = 'select Type,count(*) as num from sp group by Type'
		let result2 = await querySql(sql2)
		res.send({
			code: 0,
			msg: '获取成功',
			result: result2,
		})
	} catch (e) {
		console.log(e)
		next(e)
	}
});





module.exports = router;
