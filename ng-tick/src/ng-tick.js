function init() {

    angular.module('ngTick', [])
        .directive('clock', ['$filter', function ($filter) {

            return {
                scope: {
                    format: '@',
                    handle: '@clock',
                    trigger: '='
                },
                link: function (scope, elem, attrs) {

                    if (scope.handle)
                        scope.$root[scope.handle] = scope;

                    var filter = $filter('date');

                    var start = new Date().getTime();

                    var timer = new Tock({
                        callback: function () {

                            var tick = timer.lap();

                            var date = new Date(start + tick);

                            scope.format ? elem.text(filter(new Date(date), scope.format)) : elem.text(new Date(date));
                        }
                    });

                    scope.start = function () {
                        if (!timer.go)
                            timer.start();
                    }

                    if (!scope.trigger)
                        scope.start();
                }
            }
        }])

        .directive('ticker', ['$filter', function ($filter) {
            return {
                scope: {
                    format: '@',
                    handle: '@ticker',
                    trigger: '='
                },
                link: function (scope, elem, attrs) {

                    if (scope.handle)
                        scope.$root[scope.handle] = scope;

                    var filter = $filter('date');

                    var relative = $filter('relativeTime');

                    var moment = 0;

                    var diff = new Tock();

                    var timer = new Tock({
                        callback: function () {

                            moment = timer.lap();

                            var time = relative(timer.lap());

                            time = scope.format ? filter(time, scope.format) : timer.lap();

                            elem.text(time);
                        }
                    });

                    scope.stop = function () {

                        if (timer.go) {
                            diff.stop();
                            timer.stop();
                            if (scope.handle)
                                scope.$root[scope.handle].$emit(scope.handle + ':stop');
                        }
                    }

                    scope.reset = function () {

                            timer.reset();
                            timer.start();
                            timer.stop();
                            diff.reset();
                            diff.start();
                            diff.stop();
                            if (scope.handle)
                                scope.$root[scope.handle].$emit(scope.handle + ':reset');
                    }

                    scope.lap = function () {

                        if (timer.go) {
                            var lap = diff.lap();
                            diff.reset();
                            diff.start();

                            if (timer.go && scope.handle)
                                scope.$root[scope.handle].$emit(scope.handle + ':lap', lap);
                        }
                    }

                    scope.start = function () {

                        if (!timer.go) {
                            console.log('start');
                            diff.start();
                            timer.start(moment);
                            if (scope.handle)
                                scope.$root[scope.handle].$emit(scope.handle + ':start');
                        }
                    }

                    if (!scope.trigger)
                        scope.start();
                }
            }
        }])

        .directive('countdown', ['$filter', 'tickHelper', function ($filter, tickHelper) {
            return {
                scope: {
                    format: '@',
                    handle: '@countdown',
                    duration: '=',
                    trigger: '='
                },
                link: function (scope, elem, attrs) {

                    if (scope.handle)
                        scope.$root[scope.handle] = scope;

                    var filter = $filter('date');

                    var relative = $filter('relativeTime');

                    var timer = new Tock({
                        countdown: true,
                        interval: 1,
                        callback: function () {

                            //var round = (Math.ceil(timer.lap() / 1000) * 1000) >= 0 ? Math.ceil(timer.lap() / 1000) * 1000 : 0;
                            //var time = relative(round);

                            var time = relative(timer.lap());

                            time = filter(time, scope.format);

                            elem.text(time);
                        },
                        complete: function () {
                            if (scope.handle)
                                scope.$root[scope.handle].$emit(scope.handle + ':end');
                        }
                    });

                    scope.start = function () {

                        timer.stop();

                        var duration = tickHelper.getDuration(scope.duration);

                        timer.start(duration);
                    }

                    if (!scope.trigger)
                        scope.start();
                }
            }
        }])

        .directive('binaryClock', ['$timeout', function ($timeout) {
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

                            if (value >= 40) { value -= 40; }
                            setBit(field + '-twenties', value >= 20);
                            if (value >= 20) { value -= 20; }
                            setBit(field + '-tens', value >= 10);
                            if (value >= 10) { value -= 10; }
                            setBit(field + '-eights', value >= 8);
                            if (value >= 8) { value -= 8; }
                            setBit(field + '-fours', value >= 4);
                            if (value >= 4) { value -= 4; }
                            setBit(field + '-twos', value >= 2);
                            if (value >= 2) { value -= 2; }
                            setBit(field + '-ones', value >= 1);
                        }

                        function tick() {
                            var now = new Date();
                            setBCDs('hours', now.getHours());
                            setBCDs('minutes', now.getMinutes());
                            setBCDs('seconds', now.getSeconds());
                        }

                        tick();

                        var timer = new Tock({
                            countdown: true,
                            interval: 100,
                            callback: function () {
                                tick();
                            }
                        });

                        timer.start(Date.now());

                        //self.setInterval(tick, 500); // - mayhaps?
                    });
                }
            }
        }])

        .factory('tickHelper', [function () {

            function getDuration(chunk) {

                var now = new Date();

                now.setMilliseconds(now.getMilliseconds() + (chunk.ms || 0));
                now.setSeconds(now.getSeconds() + (chunk.s || 0));
                now.setMinutes(now.getMinutes() + (chunk.m || 0));
                now.setHours(now.getHours() + (chunk.h || 0));

                return Math.abs(now - new Date());
            }

            return {
                'getDuration': getDuration
            }
        }])

        .filter('relativeTime', [function () {
            return function (ms) {
                return new Date(1970, 0, 1).setMilliseconds(ms);
            };
        }]);
}

(function () {
    if (typeof define === 'function' && define.amd) { // RequireJS aware
        define(['angular'], function () {
            init();
        });
    } else {
        init();
    }
}());