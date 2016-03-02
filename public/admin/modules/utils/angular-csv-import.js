/* The MIT License (MIT)
Copyright (c) 2014 Bahaaldine https://github.com/bahaaldine/angular-csv-import/blob/master/LICENSE
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

/* Code from https://github.com/bahaaldine/angular-csv-import */

/*! angular-csv-import - v0.0.13 - 2014-09-18
* Copyright (c) 2014 ; Licensed  */
/*! angular-csv-import - v0.0.11 - 2014-07-12
* Copyright (c) 2014 ; Licensed  */
/*! angular-csv-import - v0.0.6 - 2014-07-11
* Copyright (c) 2014 ; Licensed  */
/*! angular-csv-import - v0.0.4 - 2014-07-10
* Copyright (c) 2014 ; Licensed  */
'use strict';

var csvImport = angular.module('ngCsvImport', []);

csvImport.directive('ngCsvImport', function() {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope:{
			content:'=',
			header: '=',
			headerVisible: '=',
			separator: '=',
			result: '='
		},
		template: '<div><div ng-show="header && headerVisible"><div class="label">Header</div><input type="checkbox" ng-model="header"></div>'+
			'<div ng-show="separator" ><div class="label">Separator</div><input type="text" ng-change="changeSeparator" ng-model="separator"></div>'+
			'<div><input class="btn cta gray" type="file"/></div></div>',
		link: function(scope, element) {            
			element.on('keyup', function(e){
				if ( scope.content != null ) {
					var content = {
						csv: scope.content,
						header: scope.header,
						separator: e.target.value
					};
					scope.result = csvToJSON(content);
					scope.$apply();
				}
			});

			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						var content = {
							csv: onLoadEvent.target.result,
							header: scope.header,
							separator: scope.separator
						};

						scope.content = content.csv;
						scope.result = csvToJSON(content);
					});
				};
				if ( (onChangeEvent.target.type === "file") && (onChangeEvent.target.files != null || onChangeEvent.srcElement.files != null) )  {
					reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
				} else {
					if ( scope.content != null ) {
						var content = {
							csv: scope.content,
							header: !scope.header,
							separator: scope.separator
						};
						scope.result = csvToJSON(content);
					}
				}
			});

			var csvToJSON = function(content) {
				var lineSeparator = "\n";	// Start with linux
				// Is this a 'windows' style new line?
				if( content.csv.indexOf("\r\n") > -1){
					lineSeparator = "\r\n";
				} else if(content.csv.indexOf("\r") > -1) {
					lineSeparator = "\r";
				}
				var lines=content.csv.split(lineSeparator);
				var result = [];
				var start = 0;
				var columnCount = lines[0].split(content.separator).length;

				var headers = [];
				if (content.header) {

					headers=lines[0].trim().split(content.separator);	// Trim to remove extraneous \r
					start = 1;
				}

				for (var i=start; i<lines.length; i++) {
					var obj = {};
					var currentline=lines[i].trim().split(content.separator);
					if ( currentline.length === columnCount ) {
						if (content.header) {
							for (var j=0; j<headers.length; j++) {
								obj[headers[j]] = currentline[j].trim();
							}
						} else {
							for (var k=0; k<currentline.length; k++) {
								obj[k] = currentline[k].trim();
							}
						}
						result.push(obj);
					}
				}
				return JSON.stringify(result);
			};
		}
	};
});