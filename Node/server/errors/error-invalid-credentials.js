const AbstractError = require('./abstract-error');

class ErrorInvalidCredentials extends AbstractError {

    constructor(message) {
        // Parent
        super();

        let default_message = 'error.invalid_credentials';
        this.message = (message) ? message : default_message;

        // Specifications
        this.status = 401;
    }
}

module.exports = ErrorInvalidCredentials;
