var app = angular.module('app', ['ngTick', 'ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode({
        enabled: true
    });

    $stateProvider
        .state('home', {
            url: '/',
            controller: 'gettingStartedCtrl',
            templateUrl: 'demo-site/view/getting-started.html'
        })
        .state('clock', {
            url: '/directives/clock',
            controller: 'clockCtrl',
            templateUrl: 'demo-site/view/directives/clock.html'
        })
        .state('countdown', {
            url: '/directives/countdown',
            controller: 'countdownCtrl',
            templateUrl: 'demo-site/view/directives/countdown.html'
        })
        .state('ticker', {
            url: '/directives/ticker',
            controller: 'tickerCtrl',
            templateUrl: 'demo-site/view/directives/ticker.html'
        });
}]);

app.controller('gettingStartedCtrl', ['$scope', function ($scope) {

}]);

app.controller('clockCtrl', ['$scope', function ($scope) {
    $scope.startClock = function (handle) {
        $scope[handle].start();
    }
}]);

app.controller('countdownCtrl', ['$scope', function ($scope) {
    $scope.startCountdown = function (handle) {
        $scope[handle].start();
    }

    $scope.$on('mycountdown:end', function (event) {
        console.log('mycountdown:end');
    });
}]);

app.controller('tickerCtrl', ['$scope', function ($scope) {
    $scope.startTicker = function (handle) {
        $scope[handle].start();
    }
}]);