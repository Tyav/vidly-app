const request = require('supertest');
const Genre = require('../../models/genres');
const mongoose = require('mongoose');
const {User} = require('../../models/user')

describe('/api/genres', () => {
	beforeEach(() => {
		server = require('../../index');
	});
	afterEach(async () => {
		server.close();
		await Genre.remove({});
	});
	describe('GET /', () => {

		it('should return all genres', async () => {
			await Genre.collection.insertMany([ { name: 'genre1' }, { name: 'genre2' } ]);
			const res = await request(server).get('/api/genres');
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some((g) => g.name === 'genre1')).toBeTruthy();
		});
	});
	describe('GET /:id', () => {
    beforeEach(() => {
      server = require('../../index');
    });
    afterEach(async () => {
      server.close();
      await Genre.remove({});
    });
  
		it('should return a 404 error if genre not found', async () => {
      const id = mongoose.Types.ObjectId().toHexString()
			//const genre = await new Genre({ name: 'genre1' }).save();
			const res = await request(server).get(`/api/genres/${id}`);
      expect(res.status).toBe(404);
    });
    it('should return genre object if found', async () => {
      //await Genre.collection.insertMany([ { name: 'genre1' }, { name: 'genre2' } ]);
			const genre = await new Genre({ name: 'genre1' }).save();
      //const genre = await Genre.findOne({name: 'genre1'});
      const res = await request(server).get(`/api/genres/${genre._id}`);
      expect(res.status).toBe(200)
      expect(res.body.name).toBe(genre.name)
    });
  });
  describe('POST /', () => {

    let token;
    let name;
    const exec = async () => {
      return await request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({name})

    }
    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1'
      
    });
    afterEach(() => {
      server.close()
    });

    it('should return a 401 if client is not logged in',async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    });
    it('should return a 400 if genre is less than five character',async () => {
//TODO
      name = '1234'
      const res = await exec()
      expect(res.status).toBe(400)
    });
    it('should return a 400 if genre is less than five character',async () => {
      name = new Array(52).join('a')
      const res = await exec()
      expect(res.status).toBe(400)
    });
    it('should save the genre if it is valid',async () => {
      await exec()
      const genre = await Genre.find({name: 'genre1'})
      expect(genre).not.toBe(null)
    });
    it('should return the genre if it is valid',async () => {
      const res = await exec()
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name')
    });
  });
});
