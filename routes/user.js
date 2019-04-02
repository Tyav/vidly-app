const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require('express');
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth')
const router = express.Router();

//GET ALL USERS
router.get('/', async (req, res) => {
	try {
		const users = await User.find().select('name email _id');
		if (!users.length)
			return res.status(200).send({
				Message: 'No User Data',
				Value: users,
			});
		return res.status(200).send(users);
	} catch (error) {
		console.log(error);
	}
});

//GET ONE USER
router.get('/me', auth, async (req, res) => {

		const id = req.user._id;
		const user = await User.findById(id).select('name email');
		if (!user)
			return res.status(400).send({
				Message: `No User Data with the id: ${id}`,
				Value: user,
			});
		return res.status(200).send(user);
});

//CREATE A USER
router.post('/create', auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) res.status(404).send(error.details[0].message);

	const users = await User.findOne({ email: req.body.email });
	if (users) return res.status(400).send(`The Email: ${req.body.email}, is already in use`);

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt)

  const newUser = await User.create(_.pick(req.body, ['name', 'email', 'password']));
  
  
  const token = newUser.generateAuthToken()
	return res.status(200).header('x-auth-token', token).send(_.pick(newUser, ['id','name', 'email']));
});

//EDIT USER INFO
router.put('/:id', auth, async (req, res) => {
		const user = await User.findById(req.params.id);
		const name = req.body.name || user.name;
		const email = req.body.email || user.email;
		const password = req.body.password || user.password;
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					name: name,
					email: email,
					password: password,
				},
			},
			{
				new: true,
			},
		);
		return res.status(200).send(updatedUser);
});

//DELETE USER
router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user)=>{
      console.log(user);
      res.send('User has been deleted')
    })
    .catch((err)=> {
      console.log(`Error: ${err}`)
    })
});

module.exports = router;
