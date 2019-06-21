const Games = require('../models/gamesModel.js')

module.exports = async function validateGame(req, res, next){
    const id = req.params.id
    try {
        const game = await Games.findById(id)
        if (game) {
            req.validGame = {
                id: game.id,
                name: game.name,
                genre: game.genre,
                releaseYear: game.releaseYear
            }
            next()
        } else {
            res.status(404).json({
                message: "Game not found."
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}