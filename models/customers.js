const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
  isGold: {
    type:Boolean,
    default: false
  },
  name: {
    type:String,
    minLength: 3,
    required: true,
    maxLength: 225
  },
  phone: {
    type:String,
    minLength: 5,
    maxLength: 11,
    required: true
  }
})

function validateCustomer(customer) {
	const schema = {
    name: Joi.string().min(3).required(),
    
	};
	return Joi.validate(customer, schema);
}




const Customer = mongoose.model('Customer', customerSchema)

module.exports = {
  Customer: Customer,
  validate: validateCustomer
}