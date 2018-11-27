const AbstractOutput = require('./abstract-output');

class ErrorOutput extends AbstractOutput {

    constructor(locale, error) {
        super();

        // Status
        this.status = error.status;
        this.name = 'Error';
        if (error.constructor && error.constructor.name) {
            this.name = error.constructor.name;
        }

        // Array of message
        if (true == Array.isArray(error.message)) {
            this.message = [];
            error.message.forEach(function(m) {
                this.message.push((locale, m));
            });
        }

        // Array of error
        if (true == Array.isArray(error.errors)) {
            let $_errors = [];
            error.errors.forEach(function(e) {
                $_errors.push({
                    type: e.type,
                    field: e.field,
                    value: e.value,
                    message: (locale, e.message)
                });
            });
            this.errors = $_errors;
        }
    }
}

module.exports = ErrorOutput;