class AbstractError {
    /**
     * Construct
     */
    constructor(message = null) {
        this.status = 500;
        this.name = this.constructor.name;

        let default_message = 'error.not_found';
        this.message = (message) ? message : default_message;
    }


}

module.exports = AbstractError;
