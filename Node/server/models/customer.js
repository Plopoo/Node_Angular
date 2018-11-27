'use strict';
module.exports = (sequelize, DataTypes) => {
	// Definition
	let customer = sequelize.define('customer', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		firstname: {
			type: DataTypes.STRING,
			allowNull: true
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: true
		},
		email: {
			validate: {
				isEmail: true
			},
			allowNull: false,
			type: DataTypes.STRING
		},
		// VIRTUALS
		username: {
			type: DataTypes.VIRTUAL,
			set: function (value) {
				this.setDataValue('username', value)
			}
		},
		password: {
			type: DataTypes.VIRTUAL,
			set: function (value) {
				this.setDataValue('password', value)
			}
		},
		role: {
			type: DataTypes.VIRTUAL,
			set: function (value) {
				this.setDataValue('role', value)
			}
		}
	}, {
			underscored: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			indexes: [{
				unique: true,
				fields: ['email']
			}],
		});

	// Associations
	customer.associate = function(models) {
		customer.belongsTo(models.user, { as: 'User', onDelete: 'cascade', hooks: true });
	};

	// Methods
	customer.prototype.getFieldsAllowedToUpdate = function() {
		let fields = [];
		let excludes = ['id', 'updated_at', 'created_at'];
		Object.keys(this.rawAttributes).forEach(function(k) {
			if (! excludes.includes(k)) {
				fields.push(k);
			}
		});
		return fields;
	};
	customer.prototype.getOwner = function (id) {
		// Get customer
		return customer.findOne({
			where: {
				id: id
			}
		}).then(
			customer => {
				return customer
			}
		)
	};

	return customer;
};