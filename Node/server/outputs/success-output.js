const AbstractOutput = require('./abstract-output');

class SuccessOutput extends AbstractOutput {
    /**
     * Construct
     * @param Album albumObject
     */
    constructor(success, data) {
        super();

        // Init
        this.success = success;
        this.data = data;
    }
}
// export the class
module.exports = SuccessOutput;
