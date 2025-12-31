const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decoded = await jwt.verify(token, 'secret')
        req.userData = decoded
        next()
    } catch(e) {
        return res.status(400).json({
            error: e.message
        })
    }
}