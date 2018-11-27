const AbstractOutput = require('./abstract-output');

class CustomerOutput extends AbstractOutput {
    /**
     * Construct
     * @param Customer customerObject
     */
	constructor(customerObject) {
		super();

		// Init
		this.id = 						customerObject.id;
		this.firstname = 				customerObject.firstname;
		this.lastname = 				customerObject.lastname;
		this.email = 					customerObject.email;

		// ID's
		this.user_id = 					customerObject.user_id;

		// If empty return null
		this.User = 					customerObject.User

		// Else ...
		if (customerObject.User != null) {
			this.User = this.getCleanedObject(['id', 'username', 'role', 'email'], customerObject.User)
		}
	}
}
// export the class
module.exports = CustomerOutput;
