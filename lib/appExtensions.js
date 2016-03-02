//
// model loader for mongoose, prevents loading dupe models.
//
module.exports = function(app) {
	// Model Loader
	app.Models = (function(){
		var models = {};
		return {
			isLoaded: function(model) {
				return (models[model] !== undefined);
			},
			get: function(model) {
				// Only run dynamic require once
				if (models[model] === undefined) {
					models[model] = require('../models/'+model)(app);
					// Initialize Dependencies once per module
					
					if (models[model].loadDependencies) {
						models[model].loadDependencies();
					}
				}
				return models[model];
			}
		};
	})();
};