﻿function init() {

    angular.module('ngTick', [])
        .directive('clock', [
            '$filter', 'engine', function ($filter, engine) {

                return {
                    scope: {
                        format: '@',
                        handle: '@clock',
                        trigger: '=',
                        offset: '@'
                    },
                    link: function (scope, elem, attrs) {

                        var offset = scope.offset ? ((parseInt(scope.offset) / 100) * 60 + new Date().getTimezoneOffset()) * 60 * 1000 : 0;

                        if (scope.handle)
                            scope.$root[scope.handle] = scope;

                        var filter = $filter('date');

                        var clock = engine.timer({
                            onTick: function (ms) {

                                var date = scope.offset ? new Date(Date.now() + offset) : new Date();

                                scope.format ? elem.text(filter(date, scope.format)) : elem.text(date);
                            }
                        });

                        scope.start = function () {
                            if (!clock.go)
                                clock.start();
                        }

                        scope.$on('$destroy', function () {

                            if (scope.handle && clock.ticking)
                                scope.$root[scope.handle].$emit(scope.handle + ':stop');

                            clock.stop();
                        });

                        if (!scope.trigger)
                            scope.start();
                    }
                }
            }
        ])
        .directive('ticker', ['$filter', 'engine', function ($filter, engine) {
            return {
                scope: {
                    format: '@',
                    handle: '@ticker',
                    trigger: '='
                },
                link: function (scope, elem, attrs) {

                    var relative = $filter('relativeTime');

                    var filter = $filter('date');

                    var timer = engine.timer({
                        onTick: function (ms) {

                            var time = relative(ms);
                            time = scope.format ? filter(time, scope.format) : time;
                            elem.text(time);
                        },
                        onLap: function (lap, ms) {
                            if (scope.handle)
                                scope.$root[scope.handle].$emit(scope.handle + ':lap', { 'lap': lap, 'elapsed': ms });
                        }
                    });

                    if (scope.handle)
                        scope.$root[scope.handle] = scope;

                    scope.start = function () {

                        if (scope.handle && !timer.ticking)
                            scope.$root[scope.handle].$emit(scope.handle + ':start');

                        timer.start();

                        return this;
                    }

                    scope.stop = function () {

                        if (scope.handle && timer.ticking)
                            scope.$root[scope.handle].$emit(scope.handle + ':stop');

                        timer.stop();

                        return this;
                    }

                    scope.reset = function () {

                        if (scope.handle)
                            scope.$root[scope.handle].$emit(scope.handle + ':reset');

                        timer.reset();

                        return this;
                    }

                    scope.lap = function () {
                        timer.lap();

                        return this;
                    }

                    scope.$on('$destroy', function () {

                        if (scope.handle && timer.ticking)
                            scope.$root[scope.handle].$emit(scope.handle + ':stop');

                        timer.stop();
                    });

                    if (!scope.trigger)
                        scope.start();
                }
            }
        }
        ])
        .directive('countdown', [
            '$filter', 'tickHelper', '$timeout', 'engine', function ($filter, tickHelper, $timeout, engine) {
                return {
                    scope: {
                        format: '@',
                        handle: '@countdown',
                        duration: '=',
                        trigger: '=',
                        interval: '='
                    },
                    link: function (scope, elem, attrs) {

                        var relative = $filter('relativeTime');

                        var filter = $filter('date');

                        if (scope.handle)
                            scope.$root[scope.handle] = scope;

                        var countdown = engine.countdown({
                            onTick: function (ms) {

                                var time = relative(ms);

                                time = filter(time, scope.format);

                                elem.text(time);
                            }
                        });

                        scope.reset = function () {
                            if (scope.handle)
                                scope.$root[scope.handle].$emit(scope.handle + ':reset');

                            countdown.reset(scope.duration);

                            return this;
                        }

                        scope.start = function () {
                            if (scope.handle && !countdown.ticking)
                                scope.$root[scope.handle].$emit(scope.handle + ':start');

                            countdown.start(scope.duration);

                            return this;
                        }

                        scope.stop = function () {
                            if (scope.handle && countdown.ticking)
                                scope.$root[scope.handle].$emit(scope.handle + ':stop');

                            countdown.stop();

                            return this;
                        }

                        scope.$on('$destroy', function () {

                            if (scope.handle && countdown.ticking)
                                scope.$root[scope.handle].$emit(scope.handle + ':stop');

                            countdown.stop();
                        });

                        if (!scope.trigger)
                            scope.start();
                    }
                }
            }
        ])
        .directive('binaryClock', [
            '$timeout', 'engine', function ($timeout, engine) {
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

                            function tick() {
                                var now = new Date();
                                setBCDs('hours', now.getHours());
                                setBCDs('minutes', now.getMinutes());
                                setBCDs('seconds', now.getSeconds());
                            }

                            tick();

                            var timer = engine.timer({
                                interval: 100,
                                onTick: function (ms) {
                                    tick();
                                }
                            });

                            timer.start();
                        });
                    }
                }
            }
        ])
        .factory('tickHelper', [
            function () {

                function getDuration(chunk) {

                    var now = new Date();

                    now.setMilliseconds(now.getMilliseconds() + (chunk.ms ? chunk.ms : 0));
                    now.setSeconds(now.getSeconds() + (chunk.s || 0));
                    now.setMinutes(now.getMinutes() + (chunk.m || 0));
                    now.setHours(now.getHours() + (chunk.h || 0));

                    return Math.abs(now - new Date());
                }

                return {
                    'getDuration': getDuration
                }
            }
        ])
        .filter('relativeTime', [
            function () {
                return function (ms) {
                    return new Date(1970, 0, 1, 0).setMilliseconds(ms);
                };
            }
        ])
        .factory('engine', function (tickHelper) {

            function timer(options) {

                options = options || {};

                var self = this;
                var start, time, thread, phantom;
                var interval = options.interval || 10;
                var lap = false;
                var lapped = 0;
                var circuit = 0;

                self.ticking = false;

                function tick() {

                    if (self.ticking) {
                        time += interval;
                        lapped += interval;

                        if (lap) {
                            lap = false;
                            self.onLap(circuit, lapped);
                            lapped = 0;
                        }

                        self.onTick(time);
                        var diff = (Date.now() - start) - time;
                        setTimeout(tick, (interval - diff));
                    }
                }

                this.onTick = options.onTick || function () { };

                this.onLap = options.onLap || function () { };

                this.reset = function () {
                    clearTimeout(thread);
                    self.ticking = false;
                    phantom = 0;
                    lapped = 0;
                    circuit = 0;
                    self.onTick(0);
                    return this;
                }

                this.start = function () {

                    if (!self.ticking) {
                        time = phantom > 0 ? phantom : 0;
                        start = Date.now() - time;
                        self.ticking = true;
                        thread = setTimeout(tick, interval);
                    }

                    return this;
                }

                this.stop = function () {
                    if (self.ticking) {
                        phantom = time;
                        self.ticking = false;
                        lapped = 0;
                    }

                    return this;
                }

                this.lap = function () {
                    if (self.ticking) {
                        lap = true;
                        circuit += 1;
                    }

                    return this;
                }
            }

            function clock(options) {

                options = options || {};

                var self = this;
                var start, time, thread;
                var interval = options.interval || 10;

                function tick() {
                    if (self.ticking) {
                        time += interval;
                        self.onTick(from);
                        var diff = (Date.now() - start) - time;
                        setTimeout(tick, (interval - diff));
                    }
                }

                this.start = function () {

                    if (!self.ticking) {
                        start = Date.now();
                        self.ticking = true;
                        thread = setTimeout(tick, interval);
                    }

                    return this;
                }
            }

            function countdown(options) {

                var self = this;
                var start, time, thread, from;
                var interval = options.interval || 10;

                self.ticking = false;

                options = options || {};

                function tick() {
                    if (self.ticking) {
                        time += interval;
                        from -= interval;
                        self.onTick(from);
                        var diff = (Date.now() - start) - time;
                        setTimeout(tick, (interval - diff));
                    }
                }

                this.onTick = options.onTick || function () { };

                this.reset = function (duration) {

                    from = tickHelper.getDuration(duration) || 0;

                    self.ticking = false;

                    self.onTick(from);

                    return this;
                }

                this.start = function (duration) {

                    from = from > 0 ? from : tickHelper.getDuration(duration) || 0;

                    if (!self.ticking) {
                        time = 0;
                        start = Date.now();
                        self.ticking = true;
                        thread = setTimeout(tick, interval);
                    }

                    return this;
                }

                this.stop = function () {
                    if (self.ticking) {
                        self.ticking = false;
                    }

                    return this;
                }

                this.ticking = false;
            }

            return {
                'timer': function (options) {
                    return new timer(options);
                },
                'countdown': function (options) {
                    return new countdown(options);
                },
                'clock': function (options) {
                    return new clock(options);
                }
            }
        });
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