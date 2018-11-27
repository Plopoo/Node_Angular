const AbstractError = require('./abstract-error');

class ErrorForbidden extends AbstractError {

    constructor(message) {
        // Parent
        super();

        let default_message = 'error.forbidden';
        this.message = (message) ? message : default_message;

        // Specifications
        this.status = 403;
    }
}

module.exports = ErrorForbidden;
