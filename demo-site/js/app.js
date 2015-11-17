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
        .state('timer', {
            url: '/directives/timer',
            controller: 'timerCtrl',
            templateUrl: 'demo-site/view/directives/timer.html'
        })
        .state('factory', {
            url: '/factory',
            controller: 'factoryCtrl',
            templateUrl: 'demo-site/view/factory.html'
        });
}]);

app.controller('gettingStartedCtrl', ['$scope', function ($scope) {

}]);

app.controller('clockCtrl', ['$scope', function ($scope) {
    $scope.startClock = function (handle) {
        $scope[handle].start();
    }

    $scope.tabs = [
        { 'title': 'Markup', 'url': 'demo-site/template/clock/markup.html' },
        { 'title': 'Controller', 'url': 'demo-site/template/clock/controller.html' }
    ];
}]);

app.controller('countdownCtrl', ['$scope', function ($scope) {

    $scope.duration = {
        'h': 1,
        'm': 30,
        's': 45,
        'ms': 500
    };

    $scope.reset = function (handle) {
        $scope[handle].reset();
    }

    $scope.start = function (handle) {
        $scope[handle].start();
    }

    $scope.stop = function (handle) {
        $scope[handle].stop();
    }

    $scope.$on('mycountdown:reset', function (event) {
        console.log('mycountdown:reset');
    });

    $scope.$on('mycountdown:start', function (event) {
        console.log('mycountdown:start');
    });

    $scope.$on('mycountdown:stop', function (event) {
        console.log('mycountdown:stop');
    });

    $scope.$on('mycountdown:end', function (event) {
        console.log('mycountdown:end');
    });

    $scope.tabs = [
        { 'title': 'Markup', 'url': 'demo-site/template/countdown/markup.html' },
        { 'title': 'Controller', 'url': 'demo-site/template/countdown/controller.html' }
    ];
}]);

app.controller('timerCtrl', ['$scope', function ($scope) {

    var lapOutput = angular.element(document.getElementById('timer-lap'));

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

    $scope.$on('mytimer:lap', function (event, response, status) {
        console.log('myticker:lap');
        console.log(status);

        if (lapOutput.children().length < 3) {
            lapOutput.append('<li>lap: ' + response.lap + ' ms: ' + response.elapsed + '</li>');
        } else if (lapOutput.children().length === 3) {
            lapOutput.append('<li>you get the idea...</li>');
        }
    });

    $scope.$on('mytimer:reset', function (event, status) {
        console.log('myticker:reset');
        console.log(status);
    });

    $scope.$on('mytimer:start', function (event, status) {
        console.log('myticker:start');
        console.log(status);
    });

    $scope.$on('mytimer:stop', function (event, status) {
        console.log('myticker:stop');
        console.log(status);
    });

    $scope.tabs = [
        { 'title': 'Markup', 'url': 'demo-site/template/timer/markup.html' },
        { 'title': 'Controller', 'url': 'demo-site/template/timer/controller.html' }
    ];
}]);

app.controller('factoryCtrl', ['$scope', 'engine', function ($scope, engine) {

    var eng = new engine();

    eng.start(1000).on(function(interval) {
        console.log(interval);
    });

    $scope.$on('$destroy', function () {
        eng.stop();
    });
}]);

app.directive('tabs', [function () {
    return {
        restrict: 'E',
        templateUrl: 'demo-site/template/tabs.html',
        scope: {
            tabs: '=',
            selected: '@'
        },
        link: function (scope, elem, attrs) {

            if (scope.tabs) {
                scope.currentTab = scope.tabs[scope.selected].url;

                scope.onClickTab = function (tab) {
                    scope.currentTab = tab.url;
                }

                scope.isActiveTab = function (tabUrl) {
                    return tabUrl === scope.currentTab;
                }
            }
        }
    }
}]);

app.directive('prism', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.ready(function () {
                Prism.highlightElement(elem[0]);
            });
        }
    }
}]);

app.directive('binaryClock', [
            '$timeout', 'tick', function ($timeout, tick) {
                return {
                    restrict: 'E',
                    template:
                        '<div id="clock">' +
                            '<div class="field" id="hours">' +
                            '<table border="0" cellspacing="0" cellpadding="0">' +
                            ' <tr>' +
                            '<td><div class="blank"></div></td>' +
                            '<td><div class="bit" id="hours-eights"></div></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><div class="blank" id="hours-forties"></div></td>' +
                            '<td><div class="bit" id="hours-fours"></div></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><div class="bit" id="hours-twenties"></div></td>' +
                            '<td><div class="bit" id="hours-twos"></div></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><div class="bit" id="hours-tens"></div></td>' +
                            '<td><div class="bit" id="hours-ones"></div></td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '<div class="field" id="minutes">' +
                            '<table border="0" cellspacing="0" cellpadding="0">' +
                            '<tr>' +
                            '<td><div class="blank"></div></td>' +
                            '<td><div class="bit" id="minutes-eights"></div></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><div class="bit" id="minutes-forties"></div></td>' +
                            '<td><div class="bit" id="minutes-fours"></div></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><div class="bit" id="minutes-twenties"></div></td>' +
                            '<td><div class="bit" id="minutes-twos"></div></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><div class="bit" id="minutes-tens"></div></td>' +
                            '<td><div class="bit" id="minutes-ones"></div></td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '<div class="field" id="seconds">' +
                            '<table border="0" cellspacing="0" cellpadding="0">' +
                            '<tr>' +
                            '<td><div class="blank"></div></td>' +
                            '<td><div id="seconds-eights" class="bit"></div></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><div id="seconds-forties" class="bit"></div></td>' +
                            '<td><div id="seconds-fours" class="bit"></div></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><div id="seconds-twenties" class="bit"></div></td>' +
                            '<td><div id="seconds-twos" class="bit"></div></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><div id="seconds-tens" class="bit"></div></td>' +
                            '<td><div id="seconds-ones" class="bit"></div></td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '</div>',
                    link: function (scope, elem, attrs) {

                        $timeout(function () {
                            function setBit(field, value) {

                                var ele = document.getElementById(field);

                                if (ele.classList.contains('blank'))
                                    return false;

                                if (value)
                                    ele.setAttribute('class', 'bit on');
                                else
                                    ele.setAttribute('class', 'bit off');
                            }

                            function setBCDs(field, value) {

                                setBit(field + '-forties', value >= 40);

                                if (value >= 40) {
                                    value -= 40;
                                }
                                setBit(field + '-twenties', value >= 20);
                                if (value >= 20) {
                                    value -= 20;
                                }
                                setBit(field + '-tens', value >= 10);
                                if (value >= 10) {
                                    value -= 10;
                                }
                                setBit(field + '-eights', value >= 8);
                                if (value >= 8) {
                                    value -= 8;
                                }
                                setBit(field + '-fours', value >= 4);
                                if (value >= 4) {
                                    value -= 4;
                                }
                                setBit(field + '-twos', value >= 2);
                                if (value >= 2) {
                                    value -= 2;
                                }
                                setBit(field + '-ones', value >= 1);
                            }

                            function tock() {
                                var now = new Date();
                                setBCDs('hours', now.getHours());
                                setBCDs('minutes', now.getMinutes());
                                setBCDs('seconds', now.getSeconds());
                            }

                            tock();

                            var timer = tick.timer({
                                interval: 100,
                                onTick: function (ms) {
                                    tock();
                                }
                            });

                            timer.start();
                        });
                    }
                }
            }
])