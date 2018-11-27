const AbstractError = require('./abstract-error');

class ErrorGone extends AbstractError {

    constructor(message) {
        // Parent
        super();

        let default_message = 'error.gone';
        this.message = (message) ? message : default_message;

        // Specifications
        this.status = 410;
    }
}

module.exports = ErrorGone;
