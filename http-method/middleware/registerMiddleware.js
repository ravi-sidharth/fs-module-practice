const jwt = require('jsonwebtoken')

const registerMiddleware = async(req,res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        res.writeHead(401) 
        return res.end(JSON.stringify({message:'Token not found!'}))
    }

    const user = jwt.verify(token,process.env.SECRET_KEY)
    if (!user) {
        res.writeHead(401) 
        return res.end(JSON.stringify({message:'Invalid user!'}))
        
    }
    
    req.user = user
  }  catch(e) {
    res.end(JSON.stringify({
        error:e.message
    }))
  }
}

module.exports = registerMiddleware