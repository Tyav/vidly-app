const mongoose =  require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema ({
  title: {
    type: String,
    required: true,
    minlength: 1
  },
  genre:{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre'
    },
    name: {
      type: String,
      // required: true
    }
  },
  numberInStock:{
    type: Number,
    min:0,
    required: true
  },
  dailyRentalRate:{
    type: Number,
    min:0,
    required: true
  }
})

module.exports = mongoose.model('Movies', movieSchema)