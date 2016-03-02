

describe('upload module', function() {

	var Service, FileUploader, scope, $window, $httpBackend;

	beforeEach(module("my.templates")); 
	beforeEach(module("upload")); 
	
	beforeEach(inject(function($injector, _$window_) {
		
		$window = _$window_;

		$httpBackend = $injector.get('$httpBackend'); 
		Service = $injector.get('UploadService');
		FileUploader = $injector.get('FileUploader');
		
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});



	describe('UploadService', function() {
		
		describe('instantiate', function() {
			it('should have getS3Signature function', function() {
				expect(Service.getS3Signature).toBeDefined();
				expect(angular.isFunction(Service.getS3Signature)).toEqual(true);
			});
			it('should have create function', function() {
				expect(Service.create).toBeDefined();
				expect(angular.isFunction(Service.create)).toEqual(true);
			});
		
		});

		
		describe('getS3Signature', function() {
			it('should return data', function() {
				var filename = "a.jpg",
					type = "images/jpeg";

				$httpBackend.expectGET('/api/v1/s3?filename=' + filename + "&contentType=" + type)
					.respond(200, {
						'path': 'https://test.s3.amazonaws.com/',
						'bucket': 'bucketname',
						'key': 'keyvalue',
						'contentType': type,
						'AWSAccessKeyId': 'awsaccesskeyid',
						'acl': 'acl',
						'policy': 'policy',
						'signature': 'signature',
						'photo': {
							'_id': '123456789',
							'extension': '.jpg',
							'filename': filename,
							'mimetype': type,
							'url': "http://cloud.com/vault/123456789.jpg"
						}
					}, {});
				
				Service.getS3Signature(filename,type).then(function(res) {
					var data = res.data;
					expect(data.bucket).toEqual("bucketname");
					expect(data.contentType).toEqual(type);
					expect(data.photo.filename).toEqual(filename);
				},function(err) {
					expect(data.photo.filename).toEqual(filename);
				});
				$httpBackend.flush();
			});
		});

		describe('create', function() {
			it('should return FileUpload object', function() {
				var uploader = Service.create([],5);
				expect(uploader).toBeDefined();
				expect(uploader.filters).toBeDefined();
				
			});
		});

	});

});