const supertest = require('supertest');

const server = require('./server.js');

const db = require('../data/dbConfig')

beforeEach(async () => {
    await db('games').truncate()
  })

describe('server', () => {

    describe('GET /', () => {

        it('responds with correct status of 200', () => {
            return supertest(server)
                .get('/')
                .expect(200)
        })

        it('responds with correct res.body { message: "Server running and ready for requests" }', () => {
            return supertest(server)
                .get('/')
                .then(res => {
                    expect(res.body).toEqual({
                        message: "Server running and ready for requests"
                    })
                })
        })
    })

    describe('GET /games', () => {
        
        it('responds with status of 200', () => {
            return supertest(server)
            .get('/games')
            .expect(200)
        })

        it('responds with correct res.body of all games', () => {
            return supertest(server)
                .get('/games')
                .then(res => {
                    expect(res.body).toHaveLength(0)
                })
        })

        it('responds with correct status on error', () => {

            return supertest(server)
                .get('/games')
                .send({ test: 'throwErr' })
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res.status).toBe(500)
                })
        })
    })

    describe('POST /', () => {

        it('should return the correct response status of 400 with no req.body', async () => {
            const newGame = { }

            await supertest(server)
            .post('/')
            .send(newGame)
            .set('Accept', 'application/json')
            .expect(400)
        })

        it('should return the correct response status of 201', async () => {
            const newGame = {
                name: 'Rocket League', genre: 'Sports', releaseYear: 2015
            }
            await supertest(server)
            .post('/')
            .send(newGame)
            .set('Accept', 'application/json')
            .expect(201)
        })

        it('should post a game to the db though the endpoint', async () => {
            const newGame = {
                name: 'Rocket League', genre: 'Sports', releaseYear: 2015
            }
            await supertest(server)
                .post('/')
                .send(newGame)
                .set('Accept', 'application/json')
                .then(res =>  {
                    expect(res.body).toEqual({
                        id: 1, name: 'Rocket League', genre: 'Sports', releaseYear: 2015
                    })
                })
        })

        it('should return the correct response status of 422 if not all required fields are submitted', async () => {
            const newGame = {
                name: 'Rocket League'
            }

            await supertest(server)
            .post('/')
            .send(newGame)
            .set('Accept', 'application/json')
            .expect(422)
        })

        it('should return the correct response status of 405 if game name is not unique', async () => {
            const newGame = {
                name: 'Rocket League', genre: 'Sports'
            }

            await supertest(server)
            .post('/')
            .send(newGame)
            .set('Accept', 'application/json')
            .expect(201)

            await supertest(server)
            .post('/')
            .send(newGame)
            .set('Accept', 'application/json')
            .expect(405)
        })
    })

    describe('GET /:id', () => {
        
        it('responds with status of 200', async () => {
            const newGame = {
                name: 'Rocket League', genre: 'Sports', releaseYear: 2015
            }
            await supertest(server)
            .post('/')
            .send(newGame)
            .set('Accept', 'application/json')
            .expect(201)

            await supertest(server)
            .get('/1')
            .expect(200)
        })
    })

    describe('PUT /:id', () => {
        it('should return the correct status', async () => {
            const newGame = {
                name: 'Rocket League', genre: 'Sports'
            }
            await supertest(server)
            .post('/')
            .send(newGame)
            .set('Accept', 'application/json')
            .expect(201)

            const updatedGame = {
                name: 'Rocket League', genre: 'Sports', releaseYear: 2015
            }
            await supertest(server)
            .put('/1')
            .send(updatedGame)
            .set('Accept', 'application/json')
            .expect(201)
        })

        it('should update the game with the given id in the db through the endpoint', async () => {
            const newGame = {
                name: 'Rocket League', genre: 'Sports'
            }
            await supertest(server)
            .post('/')
            .send(newGame)
            .set('Accept', 'application/json')
            .expect(201)

            const updatedGame = {
                name: 'Rocket League', genre: 'Sports', releaseYear: 2015
            }
            await supertest(server)
                .put('/1')
                .send(updatedGame)
                .set('Accept', 'application/json')
                .then(res =>  {
                    expect(res.body).toEqual({
                        id: 1, name: 'Rocket League', genre: 'Sports', releaseYear: 2015
                    })
                })
        })
    })

    describe('DELETE /:id', () => {
        it('should return the correct status', async () => {
            const newGame = {
                name: 'Rocket League', genre: 'Sports'
            }
            await supertest(server)
            .post('/')
            .send(newGame)
            .set('Accept', 'application/json')
            .expect(201)

            await supertest(server)
            .delete('/1')
            .expect(200)
        })

        it('should return 1 if deleted', async () => {
            const newGame = {
                name: 'Rocket League', genre: 'Sports'
            }
            await supertest(server)
            .post('/')
            .send(newGame)
            .set('Accept', 'application/json')
            .expect(201)

            await supertest(server)
                .delete('/1')
                .then(res =>  {
                    expect(res.body).toBe(1)
                })
        })
    })
    
})