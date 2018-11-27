const AbstractOutput = require('./abstract-output');
const CustomerOutput = require('./customer-output');

class UserOutput extends AbstractOutput {
    /**
     * Construct
     * @param User userObject
     */
    constructor(userObject) {
        super();

        // Init
        this.id = userObject.id;
        this.username = userObject.username;
        this.email = userObject.email;
        this.role = userObject.role;
        if (userObject.Customer != null) {
            this.Customer = new CustomerOutput(userObject.Customer);
        }
        else {
            this.Customer = userObject.Customer
        }
    }
}
// export the class
module.exports = UserOutput;
