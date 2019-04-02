const express = require('express');

const Movie = require('../models/movies');
const Genre = require('../models/genres');
const auth = require('../middleware/auth')
const router = express.Router();

//CREATE MOVIE COLLECTION
router.post('/create', auth, async (req, res) => {
	try {
    console.log('started')
    const genre = await Genre.findById(req.body.genreId);
    console.log(genre)
		if (!genre) return res.status(400).send(`Selected Genre not supported`);

    
		//joi validation goes here...

		const movie = new Movie({
			title: req.body.title,
			genre: {
				_id: req.body.genreId,
				name: genre.name,
			},
			numberInStock: req.body.numberInStock,
			dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save()
    return res.send(movie)
	} catch (error) {
		return res.status(404).send(error);
	}
});

// //DELETE MOVIE COLLECTION
router.delete('/:id', (req, res)=>{
  Movie.findByIdAndDelete(req.params.id).then(movie=>{
    if(!movie) return res.status(400).send('No such Movie');
    res.send(movie)
  })
});

// //EDIT MOVIE INFORMATION
router.put('/edit/:id', auth, async (req, res)=>{
	try {
    console.log('started')
    const genre = await Genre.findById(req.body.genreId);
    console.log(genre)
    if (!genre) return res.status(400).send(`Selected Genre not supported`);
    const movie = await Movie.findById(req.params.id);
    console.log(movie)
		if (!movie) return res.status(400).send(`Selected Genre not supported`);

    const title = req.body.title || movie.title;
    const genreId = req.body.genreId || movie.genre._id;
    const numberInStock = req.body.numberInStock|| movie.numberInStock;
    const dailyRentalRate = req.body.dailyRentalRate || movie.dailyRentalRate;
    
    
		//joi validation goes here...

    Movie.findByIdAndUpdate(req.params.id, {
      $set:{
        title: title,
        genre: {
          _id: genreId,
          name: genre.name,
        },
        numberInStock: numberInStock,
        dailyRentalRate: dailyRentalRate,
  
      }
    },{new: true}).then((updatedMovie)=>{
      return res.status(200).send(updatedMovie)
    }).catch((err)=>{
      console.log(err)
    })

	} catch (error) {
		return res.status(404).send(error);
	}
});

// //GET SINGLE MOVIE
router.get('/:id', (req, res)=>{
  try {
    Movie.findById(req.params.id).then(query=> {
      res.status(200).send(query);
    }).catch((err)=>{
      console.log(err)
    })
  }catch(error){}
});

// //GET ALL MOVIES
router.get('/', (req, res)=>{
  try {
    Movie.find().then(query=> {
      res.status(200).send(query);
    }).catch((err)=>{
      console.log(err)
    })
  }catch(error){}

});

module.exports = router;
