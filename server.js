const http = require('http');
const app = require('./app');


//set app portf
const port = 3001;
app.set("port",port);

const server = http.createServer(app);
server.listen(port);
