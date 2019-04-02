const {User} = require('../../../models/user')
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose')


//unit test for user model
describe('user.generateAuthToken', () => {
  beforeEach(() => {
    server = require('../../../index')
  });
  afterEach(() => {
    server.close()
  });

  it('should return a valid JWT', () => {
    const payload = { 
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    }
    const user = new User(payload)
    const token = user.generateAuthToken();
    const decoced = jwt.verify(token, config.get('jwtPrivateKey'))
    console.log(decoced, payload)
    expect(decoced).toMatchObject(payload);
  });
});