angular.module('logs.controller', ['ionic'])

/**
 * Logs controller
 *
 * @param services/factories
 * @return scope
 */
.controller('LogsCtrl', function(
	$scope, 		$state,
	$ionicLoading, 	$timeout,
	$location
) {
	/* Properties
	------------------------------ */
	$scope.menu = {
		tab : 'outbound'
	};
	$scope.outbound = [];
	$scope.inbound 	= [];

	/* Scope Functions
	------------------------------ */
	$scope.init = function() {		
		if (!checkLogin()) {
			$location.path('/login');
			return;
		}

		$scope.getLogs('outbound_logs');
		$scope.getLogs('inbound_logs');
		return;
	};

	$scope.getLogs = function(type) {		
		var formatted = [];
		var logs = window.localStorage.getItem(type);
		logs = JSON.parse(logs);

		if (!logs || logs.length < 1) {
			// Stop the ion-refresher from spinning
	       	$scope.$broadcast('scroll.refreshComplete');
			return;
		}

		for (var i in logs) {
			// format time
			if ('time' in logs[i] && logs[i].time) {
				logs[i].time = moment(logs[i].time).fromNow();
			}

			formatted.push(logs[i]);
		}

		// reverse array
		formatted.reverse();

		switch (type) {
			case 'outbound_logs' : $scope.outbound = formatted; break;
			case 'inbound_logs' : $scope.inbound = formatted; break;
		}

		// Stop the ion-refresher from spinning
       	$scope.$broadcast('scroll.refreshComplete');
	};

	/* Private Methods
	------------------------------ */
	var checkLogin = function() {
		var user = window.localStorage.getItem('user');
		user = JSON.parse(user);

		var settings = window.localStorage.getItem('settings');
		settings = JSON.parse(settings);

		if (!user || user.length < 1 || !settings || settings.length < 1) {
			return false;
		}

		$scope.user 	= user;
		$scope.settings = settings;
		return true;
	};

	/* Scope Init
	------------------------------ */
	$scope.init();
});