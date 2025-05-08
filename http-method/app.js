require('dotenv').config()
const http = require('http')
const connectToMongoDB = require('./db/connectToMongoDB');
const User = require('./model/user-schema');
const jwt = require('jsonwebtoken');
const registerMiddleware = require('./middleware/registerMiddleware');

function loggerMiddleware(req, res) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
}

const getRequestBody = (req) =>
    new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(err);
            }
        });
    });

const port = 3000
const app = http.createServer(async (req, res) => {
    loggerMiddleware(req, res);
    if (req.method === 'POST' && req.url === '/register') {
        const { username, password } = await getRequestBody(req);

        const user = await User.findOne({ username })

        if (user) {
            return res.end(JSON.stringify({ message: 'User already exists, Please try again with another username' }));
        }

        const registerNewUser = new User({
            username,
            password
        })
        await registerNewUser.save()
        res.writeHead(201,{
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({ message: 'User registered successfully!' }));
    }
    else if (req.method === 'POST' && req.url === '/login') {
        const { username, password } = await getRequestBody(req);

        const user = await User.findOne({ username })

        if (user.password !== password) {
            res.writeHead(404)
            return res.end(JSON.stringify({ message: 'Invalid Credential!' }));
        }
        const payload = {
            username
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY)
        res.writeHead(200, {
            'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600`,
            'Content-Type': 'application/json'
          });
        res.end(JSON.stringify({ message: 'User login successfully!', token }));
    }

    else if (req.method === 'GET' && req.url === '/profile') {
        const authorized =await registerMiddleware(req, res);
        if (!authorized) return;
        res.writeHead(200)
        res.end('Welcome to the home Page')

    }

    else if (req.method === 'GET' && req.url==='/logout') {
        res.writeHead(200, {
            'Set-Cookie': 'token=; HttpOnly; Path=/; Max-Age=0',
            'Content-Type': 'application/json'
          });
        res.end(JSON.stringify({ message: 'User logged out successfully!' }));
          
       
    } 
    
    else {
        res.writeHead(404,{
             'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({
            message:'Page not found'
        }))
    }
})

connectToMongoDB()

app.listen(port, () => console.log(`Server running at port: ${port}`))
