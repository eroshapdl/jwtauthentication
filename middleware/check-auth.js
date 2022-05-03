const jwt = require("jsonwebtoken");


module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token')

    // checking if we have token
    if(!token){
        res.status(401).json({
            errors: [
                {
                    msg: "no token found"
                }
            ]
        })
    }

    try {
        const user = await jwt.verify(token, "72te2geu2eo2elnflknlkshadoihew0fe8fry3fh")
        req.user = user.email
        next()
    } catch (error) {
        res.status(400).json({
            errors: [
                {
                    msg: 'invalid token'
                }
            ]
        })
    }
}