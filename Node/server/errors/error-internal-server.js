const AbstractError = require('./abstract-error');

class ErrorInternalServer extends AbstractError {

    constructor(message) {
        // Parent
        super();

        let default_message = 'error.internal_server';
        this.message = (message) ? message : default_message;

        // Specifications
        this.status = 500;
    }
}

module.exports = ErrorInternalServer;
