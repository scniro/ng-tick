var app = angular.module('app', ['ngTick']);

app.controller('ctrl', ['$scope', function ($scope) {

	$scope.startClock = function(handle) {
		$scope[handle].start();
	}

	$scope.startTicker = function (handle) {
		$scope[handle].start();
	}

	$scope.startCountdown = function (handle) {
		$scope[handle].start();
	}

	$scope.$on('mycountdown:end', function(event) {
		console.log('mycountdown:end');
	});
}]);