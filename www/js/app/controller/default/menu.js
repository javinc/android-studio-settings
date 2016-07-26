angular.module('menu.controller', [])

/**
 * Menu controller
 *
 * @param services/factories
 * @return scope
 */
.controller('MenuCtrl', function(
	$scope, 		$state,
	$ionicLoading, 	$timeout,
	$location
) {
	/* Properties
	------------------------------ */
	/* Scope Functions
	------------------------------ */
	$scope.init = function() {};
	
	$scope.clickLogout = function($event) {
		$event.preventDefault();

		$ionicLoading.show({
	      template: '<ion-spinner icon="android" class="spinner-light"></ion-spinner>'
	    });

	    // Disable background mode
		if (window.cordova) {
	        cordova.plugins.backgroundMode.disable();
		}

		$timeout(function() {
			$ionicLoading.hide();

			window.localStorage.removeItem('user');
			$location.path('/login');
			return;
		}, 1000);
	};

	/* Private Methods
	------------------------------ */
	/* Scope Init
	------------------------------ */
	$scope.init();
});