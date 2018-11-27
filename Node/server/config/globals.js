const ACL = require('../acl/acl')

/**
 * Variables globals
 * @return Object
 */
module.exports = function (server) {
	// Default locale
	global.default_locale = 'fr_FR';

	// Directies (from the projects root)
	global.Directory = {};
	global.Directory.upload_medias = 'uploads/medias';

	global.ACL = new ACL(global.default_locale, server);

	// Errors
	global.Errors = {};
	global.Errors.ErrorBase = require('./../errors/abstract-error');
	global.Errors.ErrorInternalServer = require('./../errors/error-internal-server');
	global.Errors.ErrorForbidden = require('./../errors/error-forbidden');
	global.Errors.ErrorNotFound = require('./../errors/error-not-found');
	global.Errors.ErrorGone = require('./../errors/error-gone');
	global.Errors.ErrorBadRequest = require('./../errors/error-bad-request');
	global.Errors.ErrorInvalidCredentials = require('./../errors/error-invalid-credentials');
	global.Errors.ErrorValidation = require('./../errors/error-validation');

	// Medias @TODO real list
	global.Medias = {};
	global.Medias.url = '/album/:album_id/media/:media_id';
	global.Medias.enabledTypes = [
		'image/jpg',
		'image/jpeg',
		'image/png',
		'image/gif',

		'video/avi',
		'video/x-flv',
		'video/mp4',
		'application/x-mpegURL',
		'video/MP2T',
		'video/3gpp',
		'video/quicktime',
		'video/x-msvideo',
		'video/x-ms-wmv',
	];

    /**
     * Get user from res
     * @param Request res
     $ @return User|null
     */
	global.getUserConnected = function (res) {
		let user = null
		if (res.oauth && res.oauth.token && res.oauth.token.user) {
			user = res.oauth.token.user.instance
		}
		return user
	};

	/**
	 * Get user id from req
	 * @param Request res
	 $ @return integer|null
	 */
	global.getUserConnectedId = function(res) {
	    let userId = null;
	    if (res.oauth.token && res.oauth.token.user) {
	        userId = res.oauth.token.user.id;
	    }
	    return userId;
	};

	/**
	* Log req
	* @param Request req
	*/
	global.logReq = function (req) {
		console.log(req)
	}

	/**
	 * Get Fields Values
	 * @param Model model
	 * @return String
	 */
	global.getFieldsValues = function (model) {
		let fields = Object.keys(model.dataValues)
		let previous = []
		fields.forEach((element) => {
			if (model.allowedFields.includes(element)) {
				previous[element] = model[element]
			}
		});

		return previous
	}
	/**
	 * Get Changed Fields
	 * @param Object previous
	 * @param Model model
	 * @return Array
	 */
	global.getChangedFields = function (previous, model) {
		let changedFields = []
		Object.keys(previous).forEach(prevKey => {
			if (previous[prevKey] != model.dataValues[prevKey]) {
				changedFields.push(prevKey)
			}
		})

		return changedFields
	}
	
	// Return global
	return global;
};
