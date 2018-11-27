require('app-module-path').addPath(__dirname + '/server');

// Lib
const readline = require('readline');
const logger = require('morgan');
const SwaggerParser = require('swagger-parser');
const restifySwaggerValidationMiddleware = require('restify-swagger-validation-middleware');

// Variables
const PORT = 3333;
const INSPECTOR = process.execArgv.includes('--inspect');

// Si le serveur est démarré avec l'option --inspect
let launchServer = function (callback) {
	if (INSPECTOR) {
		let ioInterface = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		ioInterface.question('Press Any key to start the server \n', function (answer) {
			ioInterface.close();
			callback();
		});
	} else {
		callback();
	}
}

// Server Launching
launchServer(function () {
	// Swagger
	let apiConfig = require('./server/config/swagger.json');
	SwaggerParser.validate(apiConfig).then(
		swaggerAPI => {
			// Init
			let restify = require('restify');

			let MODELS = require('models/index');
			// Launch Models
			MODELS.sequelize.sync({
				// force: true
			});

			// Create server
			let server = restify.createServer({});
			server.use(logger('dev'));

			// Init globals
			global = require('./server/config/globals')(server);

			// validation middleware requires query and body parser to be used,
			// both have to disable mapping their properties into req.params
			// so req.params only contains the route path parameters.
			server.use(restify.plugins.bodyParser({ mapParams: false }));
			server.use(restify.plugins.queryParser({ mapParams: false }));
			server.use(restifySwaggerValidationMiddleware(swaggerAPI, {}));

			// include routers
			let ROUTERS = require('routers/index')(server);

			// Errors
			let ErrorHandler = require('./server/errors/handler-errors');
			server.on('restifyError', ErrorHandler);

			// Listen
			server.listen(PORT, function () {
				console.log('REST API Server listening at http://localhost:' + PORT);
			});
		}
	);
});
