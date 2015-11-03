var app = angular.module('app', ['ngTick']);

app.controller('ctrl', ['$scope', function ($scope) {

	$scope.start = function () {
		$scope.mytick.start();
	}
}]);