// production karma.conf.js - should be on compiled code, not individual dev files
module.exports = function(config) {
	config.set({

		basePath : './',

		files: [
			"dist/assets/*.js",
			"public/bower_components/angular-mocks/angular-mocks.js",
			"public/app/tests/*.js"
		],

		autoWatch : true,
		
		frameworks: ['jasmine'],

		browsers : ['PhantomJS'],

		plugins : [
			'karma-jasmine',
			'karma-junit-reporter',
			'karma-phantomjs-launcher'
		],

		junitReporter : {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		}


	});
};