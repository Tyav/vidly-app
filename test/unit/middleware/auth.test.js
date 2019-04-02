const {User} = require('../../../models/user')
const auth = require('../../../middleware/auth')
const mongoose = require('mongoose')
let app = require('../../../index')

describe('auth middleware', () => {
  beforeEach(async () => {
    server = app;
  });
  afterEach((done) => {
    app.close()
    done();

  });
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {_id: mongoose.Types.ObjectId().toHexString(), isAdmin: true}
    const token = new User(user).generateAuthToken()
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toMatchObject(user)
  });
});