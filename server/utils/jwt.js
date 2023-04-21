import jsonwebtoken from 'jsonwebtoken'

export const createToken = (id) => {
    return jsonwebtoken.sign({ id }, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: '7d'
    })
}

export const verifyToken = async (req, res, next) => {
    try {
        let BearerToken = req.headers['authorization']
        if (BearerToken) {

            let token = BearerToken.split(' ')[1]
            let decodedToken = jsonwebtoken.verify(token, process.env.ACCESS_SECRET_TOKEN)
            req.userId = decodedToken.id
            next()
            return
        }
        return res.status(403).json({ status: false, message: 'bearer token is required' })
    } catch (error) {
        if (error instanceof jsonwebtoken.JsonWebTokenError) {
            return res.status(401).json({ status: false, message: error.message })
        }
    }
}