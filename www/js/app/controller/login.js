angular.module('login.controller', ['ionic'])

/**
 * Login controller
 *
 * @param services/factories
 * @return scope
 */
.controller('LoginCtrl', function(
	$scope, 		$state,
	$ionicPopup, 	$timeout,
	$ionicLoading, 	$location,
	$http,			$ionicPopup,
	$window
) {
	/* Properties
	------------------------------ */
	$scope.apiUrl  		= window.settings.apiUrl;
	$scope.appApiUrl  	= window.settings.appApiUrl;
	$scope.siteUrl 		= window.settings.siteUrl;
	$scope.read    		= null;

	/* Scope Functions
	------------------------------ */
	$scope.init = function() {		
		if (checkLogin()) {
			// $location.path('/');
			$window.location.href = '#/';
			return;
		}

		// get sim info
		if (window.cordova) {
			$scope.getSimInfo();
		}
	};

	$scope.getSimInfo = function() {
		var form  = $('form.login-form');

		// error call back function
		var error = function() {
			if (!form.find('ul.errors li').length) {
				var msg   = 'Sorry your device doesn\'t allow us to get your phone number, you can manually type in and login to your account.';
				var popup = $ionicPopup.alert({
					title : 'Warning',
					template : msg
				});

				popup.then(function(response) {});

				// quick fix for multiple popup on sim info
				form.find('ul.errors').append('<li>' + msg + '</li>');
			}
		};

		var success = function(result) {
			// close any loader
			$ionicLoading.hide();

			if (result && 'phoneNumber' in result && result.phoneNumber !== '') {
				$scope.simNumber = result.phoneNumber;
				form.find('input[name="number"]').val($scope.simNumber);

				$scope.$apply();
				return false;
			}

			// hide loader
			if ($scope.read) {
				error();
				return false;
			}
		};

		// get sim phone number
		window.plugins.sim.getSimInfo(success, error);
		window.plugins.sim.hasReadPermission(
			function() {
				$scope.read = true;
				$scope.$apply();
			}, error
		);

		// check if device has read permission
		$timeout(function() {
			if ($scope.read) {
				$ionicLoading.show({
					template: '<ion-spinner icon="android" class="spinner-light"></ion-spinner>'
			    });

				window.plugins.sim.requestReadPermission();
			}
		}, 2000);

		$timeout(function() {
			if ($scope.read) {
				window.plugins.sim.getSimInfo(success, error);
			}
		}, 4000);
	};

	$scope.showPopup = function(token, number, callback) {
	    $scope.device = {};

	    // An elaborate, custom popup
	    var myPopup = $ionicPopup.show({
	        template: '<input type="name" ng-model="device.name" placeholder="device name">',
	        title: 'Register this Device',
	        subTitle: 'We have detected that this is a new device. Please enter a unique device name',
	        scope: $scope,
	        buttons: [
				{ text: 'Cancel' },
	            {
	                text: '<b>Save</b>',
	                type: 'button-positive',
	                onTap: function(e) {
						console.log($scope.device);

	                    if (!$scope.device.name) {
							console.log('nope');

	                        //don't allow the user to close unless he enters wifi password
	                        e.preventDefault();
	                    } else {
							console.log('create');

							$ionicLoading.show();

							// create device
							$http.post($scope.appApiUrl + '/device?token=' + token, {
								name: $scope.device.name,
								number: number
							})
							.then(function(response) {
								$ionicLoading.hide();

								// on success
								if (!response.data) {
									showError('Something went wrong');
									return;
								}

								// on errror
								if (response.data.error) {
									showError(response.data.error.msg);
									return;
								}

								// proceed to login
								callback();
							});

	                        return $scope.deviceName;
	                    }
	                }
	            }
	        ]
	    });

	    myPopup.then(function(name) {
			console.log('tapped', name);
	    });
	};

	$scope.login = function($event) {
		$event.preventDefault();

		var form = $($event.target);

		// serialize form
		var serialized 	= form.serializeArray();
		var data 	  	= {};

		$.each(serialized, function(index, field) {
			data[field.name] = field.value;
		});

		var settings 	= { apiUrl : data.host, number : data.number };
		$scope.apiUrl 	= settings.apiUrl;
		settings 		= JSON.stringify(settings);

		// save api url for general use
		window.localStorage.setItem('settings', settings);

		if ($scope.validate(data)) {
		    var errorMsg = 'Something went wrong check if your connected to a network';
			$ionicLoading.show({
				template: '<ion-spinner icon="android" class="spinner-light"></ion-spinner>'
		    });

		    var success = function(response) {
				// check if user data is valid
				if (!response.data) {
					showError(errorMsg);
					return false;
				}

				if (response.data.error) {
					showError(response.data.error.msg);
					return false;
				}

				// set user session
				var user = JSON.stringify(response.data);
				window.localStorage.setItem('user', user);

				$timeout(function() {
					$ionicLoading.hide();
					// $location.path('/');
					window.location.href = '#/';
					window.location.reload();
					return;
				}, 1000);
			};

			var error = function(response) {
				if (!response.data) {
					showError(errorMsg);
					return;
				}

				if (response.data.error) {
					showError(response.data.error.msg);
					return;
				}
			};

			var checkNumber = function(response) {
				$ionicLoading.hide();

				if (!response.data) {
					showError(errorMsg);
					return;
				}

				if (response.data.error) {
					showError(response.data.error.msg);
					return;
				}

				var devices = response.data.device;
				for (var i in devices) {
					// check if given number exist
					if (devices[i].number == data.number) {
						// continue login
						// send login request to api
						$http.post($scope.apiUrl + '/login', data).then(success, error);

						return;
					}
				}

				// else create them
				$scope.showPopup(response.data.token, data.number, function() {
					// send login request to api
					$http.post($scope.apiUrl + '/login', data).then(success, error);
					return;
				});
			};

			// send login to app
			var params = '/login?username=' + encodeURIComponent(data.email)
				+ '&password=' + encodeURIComponent(data.password);
			$http.get($scope.appApiUrl + params).then(checkNumber);
		}
	};

	$scope.validate = function(data) {
		var valid = true;

		for (var i in data) {
			if (!data[i] || !(i in data) || data[i] === '') {
				valid = false;
			}
		}

		if (!valid) {
			showError('All fields are required!');
			return false;
		};

		return true;
	};

	$scope.redirectSignup = function() {
		if (window.cordova) {
			cordova.InAppBrowser.open($scope.siteUrl + '/signup', '_blank', 'location=yes');
		}
	};

	/* Private Methods
	------------------------------ */
	var showError = function(msg) {
		$ionicLoading.hide();

		var popup = $ionicPopup.alert({
			title : 'Error',
			template : msg
		});

		// if tapped
		popup.then(function(response) {});

		$timeout(function() {
			popup.close();
		}, 3000);
	};

	var checkLogin = function() {
		var user = window.localStorage.getItem('user');
		user = JSON.parse(user);

		if (!user || user.length < 1) {
			return false;
		}

		return true;
	};

	/* Scope Init
	------------------------------ */
	$scope.init();
});
