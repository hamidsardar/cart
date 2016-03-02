// karma.conf.js - for dev files, this is the config used in "npm test" and run during development
module.exports = function(config) {
	config.set({

		preprocessors: {
			"public/app/templates/*.html": ["ng-html2js"]
		},

		ngHtml2JsPreprocessor: {
			// the name of the Angular module to create
			stripPrefix: 'public', 
			moduleName: "my.templates"
		},

		files: [
			"public/bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js",
			"public/bower_components/jquery/dist/jquery.min.js",
			"public/bower_components/angular/angular.min.js",
			"public/bower_components/angular-ui-router/release/angular-ui-router.js",
			"public/bower_components/angular-animate/angular-animate.min.js",
			"public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
			"public/bower_components/lodash/dist/lodash.compat.js",
			"public/bower_components/angular-bootstrap-show-errors/src/showErrors.js",
			"public/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js",
			"public/bower_components/angular-file-upload/angular-file-upload.js",
			"public/bower_components/d3/d3.min.js",
			"public/bower_components/moment/min/moment.min.js",
			"public/bower_components/angular-moment/angular-moment.min.js",
			"public/bower_components/angular-filter/dist/angular-filter.min.js",
			"public/bower_components/angular-busy/dist/angular-busy.min.js",
			"public/bower_components/isoCurrency/dist/isoCurrency.min.js",
			"public/bower_components/iso-4217-currency-codes-angular/dist/iso-4217-currency-codes-angular.min.js",
			"public/lib/AngularUtils.js",
			"public/lib/console-sham.js",
			"public/app/modules/User.js",
			"public/app/modules/Upload.js",
			"public/app/modules/Home.js",
			"public/app/modules/Login.js",
			"public/app/modules/Forgot.js",
			"public/app/modules/Chargebacks.js",
			"public/app/modules/Chargeback.js",
			"public/app/modules/Account.js",
			"public/app/modules/Reporting.js",
			"public/app/modules/Dashboard.js",
			"public/app/modules/Graphing.js",
			"public/app/index.js",
			"public/app/modules/Reasoncodes.js",
			"public/app/templates/*.html",
			"public/bower_components/angular-mocks/angular-mocks.js",
			"public/app/tests/*.js"	
		],

		autoWatch : true,
		
		frameworks: ['jasmine'],

		browsers : ['PhantomJS'],

		plugins : [
			'karma-jasmine',
			'karma-junit-reporter',
			'karma-phantomjs-launcher',
			'karma-ng-html2js-preprocessor'
		],

		junitReporter : {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		}


	});
};