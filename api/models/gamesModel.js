const db = require('../../data/dbConfig')

module.exports = {
  insert,
  update,
  remove,
  getAll,
  findById,
  findBy
}

function insert(games) {
  return db('games')
    .insert(games, 'id')
    .then(ids => {
      return db('games')
        .where({ id: ids[0] })
        .first()
    })
}

async function update(id, changes) {
  await db('games')
        .where({ id })
        .update(changes, '*')

        return findById(id)
}

function remove(id) {
  return db('games')
    .where({ id })
    .del()
} 

function getAll() {
  return db('games')
}

function findById(id) {
  return db('games')
  .where({ id })
  .first()
}

function findBy(filter) {
  return db('games')
      .where(filter)
}
