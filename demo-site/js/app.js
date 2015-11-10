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
        })
        .state('binary', {
            url: '/extras/binary',
            controller: 'binaryCtrl',
            templateUrl: 'demo-site/view/extras/binary.html'
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

    $scope.reset = function (handle) {
        $scope[handle].reset();
    }

    $scope.resume = function (handle) {
        $scope[handle].resume();
    }

    $scope.start = function (handle) {
        $scope[handle].start();
    }

    $scope.stop = function(handle) {
        $scope[handle].stop();
    }

    $scope.$on('mycountdown:start', function (event) {
        console.log('mycountdown:start');
    });

    $scope.$on('mycountdown:stop', function (event) {
        console.log('mycountdown:stop');
    });

    $scope.$on('mycountdown:reset', function (event) {
        console.log('mycountdown:reset');
    });

    $scope.$on('mycountdown:resume', function (event) {
        console.log('mycountdown:resume');
    });

    $scope.$on('mycountdown:end', function (event) {
        console.log('mycountdown:end');
    });
}]);

app.controller('tickerCtrl', ['$scope', function ($scope) {

    var lapOutput = angular.element(document.getElementById('ticker-lap'));

    $scope.lap = function (handle) {
        $scope[handle].lap();
    }

    $scope.reset = function (handle) {
        $scope[handle].reset();
    }

    $scope.start = function (handle) {
        $scope[handle].start();
    }

    $scope.stop = function (handle) {
        $scope[handle].stop();
    }

    $scope.$on('myticker:reset', function (event) {
        console.log('myticker:reset');
    });

    $scope.$on('myticker:lap', function (event, response) {
        console.log('myticker:lap');

        if (lapOutput.children().length < 3) {
            lapOutput.append('<li>lap: ' + response.lap + ' ms: ' + response.elapsed + '</li>');
        } else if (lapOutput.children().length === 3) {
            lapOutput.append('<li>you get the idea...</li>');
        }
    });

    $scope.$on('myticker:start', function (event) {
        console.log('myticker:start');
    });

    $scope.$on('myticker:stop', function (event) {
        console.log('myticker:stop');
    });
}]);

app.controller('binaryCtrl', ['$scope', function ($scope) {

}]);

