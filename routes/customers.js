const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customers');
const auth = require('../middleware/auth');

//CREATE NEW CUSTOMER
router.post('/create', auth, async (req, res) => {
	const newCustomer = new Customer({
		name: req.body.name,
		isGold: req.body.isGold,
		phone: req.body.phone,
	});
	newCustomer.save().then((result) => {
		res.send(result);
	});
});

//EDIT NEW CUSTOMER
router.put('/update/:id', auth, async (req, res) => {
	const customer = await Customer.find({ _id: req.params.id });
	if (!customer.length) return res.status(400).json({ Message: 'No data matching the given id', Error: 'Not Found' });
	const update = await Customer.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				name: req.body.name || customer.name,
				isGold: req.body.isGold || customer.isGold,
				phone: req.body.phone || customer.phone,
			},
		},
		{ new: true },
	);
	res.send(update);
});

//GET CUSTOMEER BY ID
router.get('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const customer = await Customer.findById(id);
		return res.send(customer);
	} catch (error) {
		console.log();
		return res.status(400).json({ Message: 'No data matching the given id', Error: 'Not Found' });
	}
});

//GET ALL CUSTOMEERS
router.get('/', async (req, res) => {
	const customers = await Customer.find();
	res.send(customers);
});

//DELETE A USER
router.delete('/:id', async (req, res) => {
	const customer = await Customer.find({ _id: req.params.id });
	if (!customer.length) return res.status(400).json({ Message: 'No data matching the given id', Error: 'Not Found' });
	const deleted = await Customer.findByIdAndDelete(req.params.id);
	res.send(deleted);
});

module.exports = router;
