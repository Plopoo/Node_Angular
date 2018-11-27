'use strict';
const MODELS = require('./../models/index');
/*
 * Check if object exist before execute next methods
 */
module.exports.checkObjectExist = function (model) {
	return function (req, res, next) {
		let modelId = null
		let useModel = (MODELS[model]) ? MODELS[model] : null;

		if (useModel != null) {
			modelId = `${model}_id`
		}

		return useModel.findOne({
			where: {
				id: req.params.modelId,
			}
		}).then(
			customer => { next() },
			error => { next(error) }
		)
	}
};