(function() {

	angular.module('upload', ['angularFileUpload'])
	
	.config(['$provide', function($provide) {
		$provide.decorator('FileUploader', ['$delegate', '$http', function(FileUploader, $http) {
			// $delegate is FileUploader

			// add new method
			//FileUploader.prototype.yourMethod = function() {/*code*/};

			// override default over class ("nv-file-over")
			//FileUploader.FileOver.prototype.overClass = 'your-class-name';
			

			FileUploader.prototype.filters = [{
            	name: 'imageFilter',
            	fn: function(item /*{File|FileLikeObject}*/, options) {
                	var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1).toLowerCase() + '|';
                	return '|jpg|png|jpeg|bmp|gif|pdf|'.indexOf(type) !== -1;
            	}
        	}];

			FileUploader.prototype.getS3Signature = function(filename,type) {
				/* get signature block and key from server to securely upload file.
				   returned signature block is attached to direct upload to S3 */
				return $http.get('/api/v1/s3?filename=' + filename + "&contentType=" + type);
			};

			FileUploader.prototype.onAfterAddingFile = function(item) {
				
				// first get signature from server.
				this.getS3Signature(item.file.name, item.file.type).then(function (response) {
					
					// add form data for S3 authorization to upload directly
					item.formData = [
						{ 'key': response.data.key },
						{ 'Content-Type': response.data.contentType },
						{ 'AWSAccessKeyId': response.data.AWSAccessKeyId },
						{ 'acl': response.data.acl },
						{ 'policy': response.data.policy },
						{ 'signature': response.data.signature }
					];

					item.url = response.data.path;
					item.urls = {
						'orig': response.data.path
					};
					
					item.data = response.data.photo;
					item.removeAfterUpload = true;	// remove from upload queue becausae it'll show in data.uploads now
					item.upload();	// start upload

				}, function (response) {
					console.log('Error getting signature.');
				});
			};

			FileUploader.prototype.onSuccessItem = function(item, res, status, header) {
				if (item.data.extension == ".pdf") {
					item.data.urls.pdf = item.data.urls.orig;	// Save the url to the uploaded pdf. (TAJ)
					item.data.urls.orig = "/images/placeholder.png"; // This is so thumbd will work. (Justin)
				}
				if (this.type) {
					item.data.type = this.type;
				}
				console.log(item.data);
				this.uploads.push(item.data);
			};

			FileUploader.prototype.setUploads = function(uploads) {
				this.uploads = uploads;
			};

			return FileUploader;
		}]);
	}])

	.directive('ngThumb', ['$window', function($window) {
		var helper = {
			support: !!($window.FileReader && $window.CanvasRenderingContext2D),
			isFile: function(item) {
				return angular.isObject(item) && item instanceof $window.File;
			},
			isImage: function(file) {
				var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		};

		return {
			restrict: 'A',
			template: '<canvas/>',
			link: function(scope, element, attributes) {
				if (!helper.support) { return; }

				var params = scope.$eval(attributes.ngThumb);
				var canvas = element.find('canvas');

				function noPreview() {
					var errImage = new Image();
					errImage.onload = function() {
						canvas.attr({ width: 200, height: 200 });
						canvas[0].getContext('2d').drawImage(errImage, 0, 0, 200, 200);
					};
					errImage.src = "/images/document.png";
				}

				if (!helper.isFile(params.file)) {
					noPreview();
					return;
				}
				if (!helper.isImage(params.file)) {
					noPreview();
					return;
				}
				
				var reader = new FileReader();
				
				function onLoadFile(event) {
					var img = new Image();
					img.onload = onLoadImage;
					img.src = event.target.result;
				}

				function onLoadImage() {
					var width = params.width || this.width / this.height * params.height;
					var height = params.height || this.height / this.width * params.width;
					canvas.attr({ width: width, height: height });
					canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
				}

				reader.onload = onLoadFile;
				reader.readAsDataURL(params.file);
			}
		};
	}]);

})();