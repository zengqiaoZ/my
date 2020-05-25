var express = require('express');
var router = express.Router();
const querySql = require('../db/index')

//获取 会员信息 并模糊查询
router.post('/hyxx', async (req, res, next) => {
	try {
		let {
			page,
			size,
			searchMap
		} = req.body
		let {
			cardNum,
			name,
			payType,
			birthday
		} = searchMap
		let cardNum1 = "%" + cardNum + "%"
		let name1 = "%" + name + "%"
		let payType1 = "%" + payType + "%"
		let birthday1 = "%" + birthday + "%"
		let start = (page - 1) * 10
		//获取会员列表信息
		let hyxxsql =
			'select * from hyxx where name like ?  and cardNum like ? and payType like ? and birthday like ? limit ?,?'
		let hyxx = await querySql(hyxxsql, [name1, cardNum1, payType1, birthday1, start, size])
		//获取总数
		let sql2 = 'select count(*) as total from hyxx'
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

//会员信息新增
router.post('/add', async (req, res, next) => {
	try {
		console.log(req.body)
		let {
			cardNum,
			name,
			birthday,
			phone,
			integral,
			money,
			payType,
			address
		} = req.body
		birthday = birthday.split("T")[0]
		//新增会员列表  每条数据必填  不然会报错？？
		let addhyxxsql =
			'INSERT INTO hyxx(cardNum, name, birthday, phone, integral,money, payType, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
		let addhyxx = await querySql(addhyxxsql, [cardNum, name, birthday, phone, integral, money, payType, address])
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
//删除会员信息
router.post('/delete', async (req, res, next) => {
	// console.log("111"+req.body)
	let {
		id
	} = req.body
	console.log(req.body)
	console.log(id)
	try {
		let sql = 'delete from hyxx where id = ? '
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

//修改会员信息
router.put('/update', async (req, res, next) => {

	let {
		id,
		cardNum,
		name,
		birthday,
		phone,
		integral,
		money,
		payType,
		address
	} = req.body
	birthday=birthday.split("T")[0]
	try {
		let sql = 'update hyxx set cardNum = ?,name = ?,birthday = ? ,phone = ?,integral = ?,money = ?,payType = ? ,address = ? where id = ? '
		let result = await querySql(sql, [cardNum, name, birthday, phone, integral, money, payType, address,id])
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
