import jwt from 'jsonwebtoken'


export const verifytoken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if(!token) {
            return res.status(403).send("Access Denied!")
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.lenght).trimLeft()  
        }

        const verified = jwt.verify(token, process.env.SECRET_PHRASE)
        req.user = verified
        next()

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}