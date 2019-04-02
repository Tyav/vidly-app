const jwt = require('jsonwebtoken');
const config = require('config')
const Joi = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		default: 'New User',
		minlength: 3,
		maxlength: 255,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		maxlength: 1024,
  },
  isAdmin : Boolean
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
  
}

const validateUser = (data) => {
	const schema = {
		name: Joi.string().min(3).max(255).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).max(255).required(),
	};
	return Joi.validate(data, schema);
};

exports.User = mongoose.model('User', userSchema);
exports.validate = validateUser;
