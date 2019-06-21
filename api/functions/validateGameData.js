module.exports = function (req, res, next) {
    if (!isEmpty(req.body)) {
        if (req.body.name && req.body.genre) {
            req.validGameData = {
                ...req.body
            }
            next()
        } else {
            res.status(422).json({
                errorMessage: 'Missing required fields. Please do not submit any other key:values in this post request!'
            })
        }
    } else {
        res.status(400).json({
            errorMessage: 'Missing data.'
        })
    }
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)
        )
            return false
    }
    return true
}