﻿var app = angular.module('app', ['ngTick', 'ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode({
        enabled: true
    });

    $stateProvider
        .state('home', {
            url: '/',
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
        .state('formatting', {
            url: '/formatting',
            templateUrl: 'demo-site/view/formatting.html'
        })
        .state('factory', {
            url: '/factory',
            templateUrl: 'demo-site/view/factory.html'
        });
}]);

app.controller('clockCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

    $timeout(function() {
        $scope.myclock.start();
    });

    $scope.tabs = [
        { 'title': 'Markup', 'url': 'demo-site/template/clock/markup.html' },
        { 'title': 'Controller', 'url': 'demo-site/template/clock/controller.html' }
    ];
}]);

app.controller('countdownCtrl', ['$scope', function ($scope) {

    $scope.duration = { 'h': 1, 'm': 30, 's': 45, 'ms': 500 };

    $scope.end = function() {
        $scope.mycountdown.end();
    }

    $scope.reset = function () {
        $scope.mycountdown.reset();
    }

    $scope.start = function () {
        $scope.mycountdown.start();
    }

    $scope.stop = function () {
        $scope.mycountdown.stop();
    }

    $scope.tabs = [
        { 'title': 'Markup', 'url': 'demo-site/template/countdown/markup.html' },
        { 'title': 'Controller', 'url': 'demo-site/template/countdown/controller.html' }
    ];
}]);

app.controller('timerCtrl', ['$scope', function ($scope) {

    var output = angular.element(document.getElementById('timer-lap'));

    $scope.lap = function () {
        $scope.mytimer.lap();
    }

    $scope.reset = function () {
        $scope.mytimer.reset();
    }

    $scope.start = function () {
        $scope.mytimer.start();
    }

    $scope.stop = function () {
        $scope.mytimer.stop();
    }

    $scope.$on('mytimer:lap', function (event, status, lap, lapped) {
        if (output.children().length < 3) {
            output.append('<li>lap ' + '<span class="demo-lap">' + lap + '</span> ms elapsed ' + '<span class="demo-lapped">' + lapped + '</span></li>');
        } else if (output.children().length === 3) {
            output.append('<li>you get the idea...</li>');
        }
    });

    $scope.tabs = [
        { 'title': 'Markup', 'url': 'demo-site/template/timer/markup.html' },
        { 'title': 'Controller', 'url': 'demo-site/template/timer/controller.html' }
    ];
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
    'engine', function(engine) {
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
            link: function(scope, elem, attrs) {

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

                var eng = new engine();

                eng.start(100).on(function(interval) {
                    var now = new Date();
                    setBCDs('hours', now.getHours());
                    setBCDs('minutes', now.getMinutes());
                    setBCDs('seconds', now.getSeconds());
                });

                scope.$on('$destroy', function() {
                    eng.stop();
                });
            }
        }
    }
]);