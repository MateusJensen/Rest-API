const http = require('http')
const app = require('./controllers/app')

const server = http.createServer(app);
server.listen(5000);
