const mongoose = require('mongoose')
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 225
  }
})

module.exports = mongoose.model('Genre', genreSchema)


// const genres = [ { id: 1, name: 'action' }, { id: 2, name: 'horrors' }, { id: 3, name: 'romance' } ];
