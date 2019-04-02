const validateObjectId = require('../middleware/validateObjectId')
const express = require('express');
const router = express.Router();
const Genre = require('../models/genres');
const Joi = require('joi');
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');

router.get('/', async (req, res, next) => {
	//Validation
		const genres = await Genre.find({});
		res.send(genres)
	})
	//res.json (genres);
;

router.get('/:id', validateObjectId,async(req, res) => {
	//const genre =
	const genre = await Genre.findById(req.params.id)
	if (!genre) return res.status(404).send(`There is no genre with the ID: ${req.params.id}`);

	res.send(genre);

});

router.post('/', auth, async (req, res) => {

	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = new Genre({
		name: req.body.name,
	});
		await genre.save();
		res.json(genre);
});

router.put('/:id', auth, async (req, res) => {
	const { error } = validateGenre(req.body);
	if (error) return res.status(404).send(error.details[0].message);

	const genre = await Genre.find({
		_id: req.params.id,
	});
	if (!genre) return res.status(404).send(`There is no genre with the ID: ${req.params.id}`);

});

router.delete('/:id',[auth, admin], (req, res) => {
	Genre.findByIdAndRemove(req.params.id).then((genre)=> {
		if (!genre) return res.status(404).send(`There is no genre with the ID: ${req.params.id}`);
			res.send(genre);
	})
});


function validateGenre(genre) {
	const schema = {
		name: Joi.string().min(5).max(50).required(),
	};
	return Joi.validate(genre, schema);
}

module.exports = router;
