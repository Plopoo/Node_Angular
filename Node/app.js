let http = require('http');
let server = http.createServer();
let port = 8080;

server.on('request', (request, response) => {
    
    response.writeHead(200);
    response.end("Coucou");

});

server.listen('Node is running on port : '+ port);