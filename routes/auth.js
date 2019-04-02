const Joi = require('joi')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require('express');
const { User } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if (error) res.status(400).send(error.details[0].message);

	const user = await User.findOne({ email: req.body.email });
	if (!user ) return res.status(400).send(`Invalid Email or Password`);

  const validPassword = bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send(`Invalid Email or Password`);

  
  //const newUser = await User.create(_.pick(req.body, ['name', 'email', 'password']));
  
  const token = user.generateAuthToken()
	return res.status(200).send(token);
});

const validate = (data) => {
	const schema = {
		email: Joi.string().email().required(),
		password: Joi.string().min(6).max(255).required(),
	};
	return Joi.validate(data, schema);
};


module.exports = router