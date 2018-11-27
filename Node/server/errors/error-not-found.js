const AbstractError = require('./abstract-error');

class ErrorNotFound extends AbstractError {

    constructor(message) {
        // Parent
        super();

        let default_message = 'error.not_found';
        this.message = (message) ? message : default_message;

        // Specifications
        this.status = 404;
    }
}

module.exports = ErrorNotFound;
