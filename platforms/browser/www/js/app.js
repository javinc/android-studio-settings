
var dependencies = window.settings.libraries
	.concat(window.settings.controllers)
	.concat(window.settings.services)
	.concat(window.settings.directives);

var app = angular.module('phonegle', dependencies)

/**
 * App main controller
 *
 * @param route provider
 */
app.config(function(
	$locationProvider, 	$stateProvider, 
	$urlRouterProvider, $ionicConfigProvider
) {
	$ionicConfigProvider.navBar.alignTitle('center');
	$urlRouterProvider.otherwise('/login');

	$stateProvider
		.state('app', {
			url : '',
			abstract : true,
			templateUrl : './template/default/menu.html',
			controller : 'MenuCtrl'
		})

		.state('app.home', {
			url : '/',
			views : {
				menuContent : {
					templateUrl : './template/home.html',
					controller: 'HomeCtrl'
				}
			}
		})

		.state('app.logs', {
			url : '/logs',
			views : {
				menuContent : {
					templateUrl : './template/logs.html',
					controller : 'LogsCtrl'
				}
			}
		})

		.state('login', {
			url : '/login',
			templateUrl : './template/login.html',
			controller : 'LoginCtrl'
		});

	$locationProvider.html5Mode({
		enabled: false
	});
});