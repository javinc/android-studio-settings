(function() {
	'use strict';
}());

angular.module('home.controller', [])

/**
 * Home controller
 *
 * @param services/factories
 * @return scope
 */
.controller('HomeCtrl', function(
	$scope, 		$state,
	$timeout,  		$location,
	$http,			$ionicPopup,
	$ionicLoading,	$ionicPlatform,
	$base64
) {
	/* Properties
	------------------------------ */
	$scope.user   	= {};
	$scope.settings = {};
	$scope.ready 	= false;
	$scope.sending 	= false;
	$scope.toggle 	= {
		online 	: $('span.status.online'),
		sms 	: $('span.status.sms'),
		inbound : $('span.status.inbound')
	};

	$scope.status = {
		outbound : false,
		inbound  : false
	};

	var outboundProcess = null; // outbount interval process

	/* Scope Functions
	------------------------------ */
	$scope.init = function() {
		if (!checkLogin()) {
			$location.path('/login');
			return;
		}

		// set http config - add user token as header
	    $scope.settings.config = {
		    headers : {
		    	'authorization' : 'Basic ' + $base64.encode($scope.user.token + ':')
		    }
	    };

	    $ionicPlatform.registerBackButtonAction(function(e) {
			if ($state.current.name == 'app.home') {
				e.preventDefault();
				return;
			}

			navigator.app.backHistory();
		}, 100);

	    if ($scope.checkConnection()) {
	    	// prevent the app from going to sleep in backgound
		    if (window.cordova) {
		    	$scope.runInBackground();
		    }

	    	// watch inbound sms
	    	$scope.watchInbound();

	    	// outbound sms long polling
			$scope.pullSms();
	    }
	};

	$scope.runInBackground = function() {
		// enable background service
		cordova.plugins.backgroundMode.enable();

		// customize title
		cordova.plugins.backgroundMode.setDefaults({
			title : 'Iris text is running in backgound',
			text  : 'SMS service active'
		});

		var timer;

		// notification when background mode has been activated
		cordova.plugins.backgroundMode.onactive = function() {
			var counter = 0;

			// update badge counter
			timer = setInterval(function() {
				counter++;
				console.log('Running since ' + counter + ' sec');
				cordova.plugins.notification.badge.set(counter);
			}, 1000);
		};

		// background mode deactivated
		cordova.plugins.backgroundMode.ondeactivate = function() {
			clearInterval(timer);
			cordova.plugins.notification.badge.clear();
		};

		// keep it wake
		window.powerManagement.dim(function() {
			console.log('Wakelock acquired');
		}, function() {
			console.log('Failed to acquire wakelock');
		});

		// keep it wake
		window.powerManagement.setReleaseOnPause(false, function() {
			console.log('setReleaseOnPause successfully');
		}, function() {
			console.log('Failed to set');
		});
	};

	$scope.checkConnection = function() {
		var onoffline = function() {
	    	var status = 'off';
	    	var msg    = 'You are currently offline, connect to a wifi or data connection to activate sms service';

	    	// show pop for offline
	    	showPopup('Warning', msg, true);

	    	// toggle status indicator
	    	$scope.toggle.online
	    		.attr('data-status', status)
	    		.text(status);

	    	$scope.toggle.sms
	    		.attr('data-status', status)
	    		.text(status);

	    	$scope.toggle.inbound
	    		.attr('data-status', status)
	    		.text(status);

	    	// set status
	    	$scope.status.inbound  = false;
	    	$scope.status.outbound = false;

	    	// stop outbound process
	    	$timeout.cancel(outboundProcess);

	    	// disable background service
	    	if (window.cordova) {
	    		cordova.plugins.backgroundMode.disable();
	    	}
	    };

	    var ononline = function() {
	    	var status = 'on';

	    	// show pop for offline
	    	showPopup('Connection Active', 'You are now back online', true);

	    	$scope.toggle.online
	    		.attr('data-status', status)
	    		.text(status);

	    	if (!$scope.status.inbound) {
	    		$scope.toggle.inbound
					.attr('data-status', status)
					.text(status);
	    	}

	    	if (!$scope.status.outbound) {
	    		$scope.toggle.sms
					.attr('data-status', status)
					.text(status);

	    		$scope.pullSms();
	    	}

	    	// enable background service
	    	if (window.cordova) {
	    		$scope.runInBackground();
	    	}
	    };

	    // trigger offline and online event
	    if (window.cordova) {
		    document.addEventListener('offline', onoffline, false);
		    document.addEventListener('online', ononline, false);
	    }

	    // check if offline
	    var isOffline = 'onLine' in navigator && !navigator.onLine;

	    if (isOffline) {
	    	onoffline();
	    	return false;
	    }

	    return true;
	};

	$scope.pullSms = function() {
		if (!$scope.ready) {
			$ionicLoading.show({
				template: '<ion-spinner icon="android" class="spinner-light"></ion-spinner>'
		    });
		}

		// check if still sending
		if ($scope.sending) {
			console.log('outbound still processing');

			// return after 2 seconds
			// outboundProcess = $timeout($scope.pullSms, 2000);
			//
			// return;
		}

		// set outbound service status
		$scope.status.outbound = true;

	    // filter by account phone number
	    var query = {
	    	filters : {
	    		'origin' : $scope.settings.number
	    	}
	    };

	    var url    = $scope.settings.apiUrl + '/outbox?' + $.param(query);
	    var config = $scope.settings.config;

	    var success = function(response) {
        	if (response.data.error) {
				showPopup('Error', response.data.error.msg);

				outboundProcess = $timeout($scope.pullSms, 5000);

				return false;
			}

			if (!$scope.ready) {
				// hide loader
				$ionicLoading.hide();

				// show pop for message queued
				var msg = 'Your messages are now queued, to activate and send all your sms put the app on the background.';
				showPopup('SMS service is now ready', msg, true);
				$scope.ready = true;
			}

			var messages = response.data;
			for (var i in messages) {
				if (messages[i]) {
					$scope.sendSMS(messages[i]);
				}
			}

			// long polling
			outboundProcess = $timeout($scope.pullSms, 2000);

			return;
        };

        var error = function(response) {
        	$ionicLoading.hide();

			if (response.data.error) {
				showPopup('Error', response.data.error.msg);
			}

			// long polling
			outboundProcess = $timeout($scope.pullSms, 5000);

			return false;
        };

        // pull sms notifs from api server
        $http.get(url, config).then(success, error);
	};

	$scope.sendSMS = function(msg) {
		var options = {
            replaceLineBreaks : false,
            android : {
                intent : ''
            }
        };

        var number  = String(msg.address.trim());
        var message = String(msg.text);
        var id = msg.id;

		// flag sending
		$scope.sending = true;

    	// send sms status to api
        var success = function() {
        	showPopup('Alert', 'App successfully <strong>send</strong> message', true);

			$scope.sending = false;

        	// show status and save log
        	$scope.sendStatus(id, 'done');
        	$scope.saveLog({
        		to 		: number,
        		message : message,
        		type 	: 'outbound',
        		status 	: 'done'
        	});

        	$scope.$apply();
        };

        var error = function(e) {
        	showPopup('Alert', 'App Error <strong>send</strong> message', true);

			$scope.sending = false;

        	$scope.sendStatus(id, 'error');
        	$scope.saveLog({
        		to 		: number,
        		message : message,
        		type 	: 'outbound',
        		status 	: 'error'
        	});

        	$scope.$apply();
        };

        sms.send(number, message, options, success, error);
	};

	$scope.sendStatus = function(id, status) {
		var data   = { status : status };
		var url    = $scope.settings.apiUrl + '/outbox/' + id;
		var config = $scope.settings.config;

		var success = function(response) {
			if (response.data.error) {
				showPopup('Error', response.data.error.msg);
				return false;
			}
		};

		var error = function(response) {
			if (response.data.error) {
				showPopup('Error', response.data.error.msg);
				return false;
			}
		};

		$http.put(url, data, config).then(success, error);
	};

	$scope.watchInbound = function() {
		if (!window.cordova) return false;

		// start watching sms events
		if (SMS) {
			// set inbound service status
			$scope.status.inbound = true;

			var watchSuccess = function() {
				$scope.toggle.inbound
		    		.attr('data-status', 'on')
		    		.text('on');
	        };

	        var watchError = function() {
	        	$scope.toggle.inbound
		    		.attr('data-status', 'off')
		    		.text('off');
	        };

			SMS.startWatch(watchSuccess, watchError);

			// stores possible multipart message
			var multiPartMsg = {};
			var multiPartReq = {};
			var multiPartLeeway = 2000;

			var waitSend = function(key, msg, callback) {
			    return $timeout(function () {
			        console.log('isMultiPartMsg ' + key + ' SENT!');

			        callback(msg);
			        delete(multiPartMsg[key]);
			        delete(multiPartReq[key]);
			    }, multiPartLeeway);
			};

			var isMultiPartMsg = function(msg, callback) {
				// i did remove + sign and prefix with "k"
				// incase the address doesnt have a + sign
				key = 'k' + msg.address.replace('+', '');

				console.log('isMultiPartMsg ' + key);

				// record new posible concatenation
				if (multiPartMsg[key] == undefined) {
					console.log('isMultiPartMsg ' + key + ' posible concat');

					multiPartMsg[key] = msg.text;

					// time out send and 2 second leeway
					multiPartReq[key] = waitSend(key, msg, callback);

					return true;
				}

				console.log('isMultiPartMsg ' + key + ' existing concat');

				// clear timeout
				$timeout.cancel(multiPartReq[key]);

				// it mean something
				multiPartMsg[key] += msg.text
				msg.text = multiPartMsg[key];

				// time out send waiting for another msg
				multiPartReq[key] = waitSend(key, msg, callback);

				return true;
			};

			document.addEventListener('onSMSArrive', function(e) {
	            var sms = e.data;

				console.log(sms);

	            if (sms) {
					var message = {
						text 	: sms.body,
						origin 	: $scope.settings.number,
						address : sms.address
					};

					var url    = $scope.settings.apiUrl + '/inbox';
					var config = $scope.settings.config;

					var success = function(response) {
						showPopup('Alert', 'App successfully <strong>received</strong> 1 message', true);

						// save log
						$scope.saveLog({
			        		from    : message.address,
			        		message : message.text,
			        		type 	: 'inbound',
			        		status 	: 'done'
			        	});

						if (response.data.error) {
							showPopup('Error', response.data.error.msg);
							return false;
						}

						$scope.$apply();
					};

					var error = function(response) {
						// save log
						$scope.saveLog({
			        		from    : message.address,
			        		message : message.text,
			        		type 	: 'inbound',
			        		status 	: 'error'
			        	});

						if (response.data.error) {
							showPopup('Error', response.data.error.msg);
							return false;
						}

						$scope.$apply();
					};

					isMultiPartMsg(message, function(m) {
						$http.post(url, m, config).then(success, error);
					});
	            }
	        });
		}
	};

	$scope.saveLog = function(data) {
		// set log time
		data.time = Date.now();

		var type = data.type;
		var logname = type + '_logs';

		// check if isset logs
		var logs = window.localStorage.getItem(logname);
		logs = JSON.parse(logs);

		if (!logs || logs.length < 1) {
			logs = JSON.stringify([data]);
			window.localStorage.setItem(logname, logs);
			return;
		}

		// remove last log if logs is more than 20
		if (logs && logs.length > 20) {
			logs.shift();
		}

		logs.push(data);
		logs = JSON.stringify(logs);

		window.localStorage.setItem(logname, logs);
		return;
	};

	/* Private Methods
	------------------------------ */
	var showPopup = function(type, msg, close) {
		var popup = $ionicPopup.alert({
			title : type,
			template : msg
		});

		// if tapped
		popup.then(function() {});

		// if pop up close
		if (close) {
			$timeout(function() {
				popup.close();
			}, 3000);
		}
	};

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
