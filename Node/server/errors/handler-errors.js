const ErrorOutput = require('./../outputs/error-output');

module.exports = function(req, res, err, next) {
    // Error
    switch (err.constructor.name) {
        case 'ValidationError':
            err = new Errors.ErrorValidation(err);

        case '':
            if (err.body && err.body.code) {
                if ('MethodNotAllowed' == err.body.code) {
                    err = new Errors.ErrorNotFound('error.not_found.method');
                } else if ('ResourceNotFound' == err.body.code) {
                    err = new Errors.ErrorNotFound('error.not_found.route');
                }
            }

        default:
            // Status
            err.status = err.status ? err.status : 500;

            // Console log on Error 500
            if (err.status == 500) {
                console.log("\x1b[47m", 'Error handler: '.red);
                console.log("\x1b[47m", "\x1b[31m", err);
                console.log("\x1b[0m");
            }

            // Response
            res.status(err.status);

            // Locale
            let locale = default_locale;
            if (res.hasOwnProperty('getLocale')) {
                locale = res.getLocale();
            }

            // Response
            res.json(new ErrorOutput(locale, err));
    }
};