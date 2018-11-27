const AbstractError = require('./abstract-error');

class ErrorBadRequest extends AbstractError {

    constructor(message, errors) {
        // Parent
        super();

        let default_message = 'error.bad_request';
        this.message = (message) ? message : default_message;
        this.errors = (errors) ? errors : undefined;

        // Specifications
        this.status = 400;
    }
}

module.exports = ErrorBadRequest;
