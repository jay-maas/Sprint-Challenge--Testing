const db = require('../../data/dbConfig.js')

const { insert, getAll, remove, findById, update, findBy } = require('./gamesModel.js')

beforeEach(async () => {
  await db('games').truncate()
})

describe('games model', () => {

  it('should set environment to testing', () => {
    expect(process.env.DB_ENV).toBe('testing')
  })

  describe('insert()', () => {
    it('should insert games', async () => {
      await insert({ name: 'Rocket League', genre: 'Sports', releaseYear: 2015})
      await insert({ name: 'NBA 2k19', genre: 'Sports' })

      const games = await db('games')

      expect(games).toHaveLength(2)
    })

    it('should insert the provided game', async () => {
      let game = { name: 'Rocket League', genre: 'Sports', releaseYear: 2015}
      let inserted = await insert(game)
      expect(inserted.name).toBe(game.name)
    })
  })

  describe('getAll()', () => {
    it('should retrieve data from test db', async () => {
      await insert({ name: 'Rocket League', genre: 'Sports', releaseYear: 2015})
      await insert({ name: 'NBA 2k19', genre: 'Sports' })

      const games = await getAll()
  
      expect(games).toHaveLength(2)
    })
  })

  describe('remove()', () => {
    it('remove the game within the database with the provided id', async () => {
      await insert({ name: 'Rocket League', genre: 'Sports', releaseYear: 2015})

      await remove(1)

      const games = await getAll()
      expect(games).toHaveLength(0)
    })
  })

  describe('findById()', () => {
    it('find a game by their id', async () => {
      await insert({ name: 'Rocket League', genre: 'Sports', releaseYear: 2015})

      const game = await findById(1)
      expect(game).toEqual({ 
        id: 1,  
        name: 'Rocket League', 
        genre: 'Sports', 
        releaseYear: 2015
      })
    })
  })

  describe('update', () => {
    it('update games info', async () => {
      await insert({ name: 'rocket league', genre: 'Action'})

      const updatedGame = {
        name: 'Rocket League',
        genre: 'Sports',
        releaseYear: 2015
      }
      
      await update(1, updatedGame)

      const game = await findById(1)
      expect(game).toEqual({ 
        id: 1, 
        name: 'Rocket League',
        genre: 'Sports',
        releaseYear: 2015
      })
    })
  })

  describe('findBy()', () => {
    it('find game/games by the given parameter', async () => {
      await insert({ name: 'Rocket League', genre: 'Sports', releaseYear: 2015})
      await insert({ name: 'NBA 2k19', genre: 'Sports'})
      const genre = 'Sports'
      const game = await findBy({ genre })
      expect(game).toEqual(
        [
          { 
          id: 1,  
          name: 'Rocket League', 
          genre: 'Sports', 
          releaseYear: 2015
          },
          { 
          id: 2,  
          name: 'NBA 2k19', 
          genre: 'Sports',
          releaseYear: null
          }
        ]
      )
    })
  })

})
