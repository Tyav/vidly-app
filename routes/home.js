const express = require('express')
const router = express.Router()

router.get('', (req, res) => {
  res.send('<h1>This is a Genre api Home Page</h1>')
})
module.exports = router;