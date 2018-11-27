const AbstractError = require('./abstract-error');

class ErrorValidation extends AbstractError {

    constructor(validatonErrorObject) {
        // Parent
        super();
        
        // message
        this.message = 'error.validation';

        // Errors
        if (validatonErrorObject.body && validatonErrorObject.body.errors) {
            let $_errors = [];
            let $_this = this;
            validatonErrorObject.body.errors.forEach(function(e) {
                $_errors.push($_this.generateValidationError(e));
            });
            this.errors = $_errors;
        }

        // status
        this.status = validatonErrorObject.statusCode;
    }

    /**
     * Get dataPath to array
     * @param string $dataPath
     * @param array
     */
    getDataPathArray(datapath) {
        let dataPathArray = (datapath.replace(/^\./, '').split('.'));
        return dataPathArray;
    }

    /**
     * Generate transkation Key
     *
     * @param object error
     * @return string
     */
    generateValidationError(error) {
        let field = null;
        let value = null;
        let message = 'validation.';
        let dataPathArray = this.getDataPathArray(error.dataPath);

        switch (dataPathArray[0]) {
        // Body data
        case 'body':
            switch (error.keyword) {
            case 'required':
                // Field
                field = error.params.missingProperty;

                // value
                if (Array.isArray(error.data) && error.data[field]) {
                    value = error.data[field];
                }
                break;

            default:
                // field
                field = dataPathArray.pop();

                // value
                value = error.data;
            }

            // message
            message += 'body.';
            message += error.keyword + '.';
            message += field;

            // value
            break;

            // Uri params
        case 'path':
            // Field
            field = dataPathArray.pop();

            // Value
            value = error.data;

            message += 'path.';
            message += error.keyword + '.';
            message += error.schema;
            break;

            // Query data
        case 'query':
            // field
            field = (error.params && error.params.missingProperty) ? error.params.missingProperty : 'default';

            // value
            if (error.data && error.data[field]) {
                value = error.data[field];
            }

            // message
            message += 'body.';
            message += error.keyword + '.';
            message += field;
        default:
        }

        return {
            type: dataPathArray[0],
            field: field,
            value: value,
            message: message
        };
    }
}

module.exports = ErrorValidation;
