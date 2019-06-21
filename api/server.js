const express = require('express')

const gamesModel = require('./models/gamesModel.js')

const validateGame = require('./functions/validateGame.js')
const validateGameData = require('./functions/validateGameData.js')

const server = express()

server.use(express.json())

server.get('/',  async (req, res) => {
    res.status(200).json({
        message: "Server running and ready for requests"
    })
})

server.get('/games',  async (req, res) => {
    console.log(req.body)
    try {
        //for testing purposes only 
        if(req.body.test && req.body.test === 'throwErr') {
            throw new Error('testing for error of 500')
        }
        const games = await gamesModel.getAll()
        res.status(200).json(games)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

server.post('/', validateGameData, async (req, res) => {
    try {
        const newGame = await gamesModel.insert(req.validGameData)
        res.status(201).json(newGame)
    } catch (error) {
        console.log(error)
        if(error.errno === 19) {
            res.status(405).json(error)
        } else {
            res.status(500).json(error)
        }
    }
})

server.put('/:id', validateGame, validateGameData, async (req, res) => {
    try {
        const updatedGame = await gamesModel.update(req.validGame.id, req.validGameData)
        res.status(201).json(updatedGame)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

server.delete('/:id', validateGame, async (req, res) => {
    try {
        const deletedGame = await gamesModel.remove(req.validGame.id)
        res.status(200).json(deletedGame)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = server