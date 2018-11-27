const initializeSwagger = require('swagger-tools').initializeMiddleware;

const restify = require('restify');
const swaggerTools = require('swagger-tools');
const swaggerDoc = require('./server/config/swagger.json');

// Configure non-Swagger related middleware and server components prior to Swagger middleware
let PORT = 3334;
initializeSwagger(swaggerDoc, function(swaggerMiddleware) {
    const swaggerUi = swaggerMiddleware.swaggerUi({
        swaggerUiDir: './public/swagger-ui',
        dom_id: '#swagger-ui',
        url: '/api-docs'
    });

    let server = restify.createServer();
    server.get('/*', restify.plugins.serveStatic({
        directory: 'public'
    }));
    server.get('/docs', swaggerUi);
    server.head('/docs', swaggerUi);
    server.get('/api-docs', swaggerUi);

    server.listen(PORT, () => {
        console.log('API Docs on http://localhost:3334/docs');
    });
});
