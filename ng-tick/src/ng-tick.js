function init() {

    angular.module('ngTick', [])
        .directive('clock', [
            '$filter', 'tick', function ($filter, tick) {
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

                        var clock = tick.engine({
                            interval: function (interval) {
                                var date = scope.offset ? new Date(Date.now() + offset) : new Date();

                                scope.format ? elem.text(filter(date, scope.format)) : elem.text(date);
                            }
                        });

                        scope.start = function () {
                            clock.start(100);
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
        .directive('timer', ['$filter', 'tick', function ($filter, tick) {
            return {
                scope: {
                    format: '@',
                    handle: '@timer',
                    trigger: '='
                },
                link: function (scope, elem, attrs) {

                    var relative = $filter('relativeTime');

                    var filter = $filter('date');

                    var timer = tick.timer({
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
            '$filter', '$timeout', 'tick', function ($filter, $timeout, tick) {
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

                        var countdown = tick.countdown({
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
        .factory('tick', function (tickHelper) {

            function engine(options) {

                var time, thread, start, ticking, interval;
                var self = this;

                function tick() {
                    if (ticking) {
                        time += interval;
                        self.interval(interval);
                        var diff = (Date.now() - start) - time;
                        setTimeout(tick, (interval - diff));
                    }
                 }

                this.start = function (intv) {

                    interval = intv || 10;
                    start = Date.now();
                    time = 0;
                    ticking = true;
                    thread = setTimeout(tick, interval);
                }

                this.interval = options.interval || function () { };

                this.stop = function() {
                    ticking = false;
                }
            }

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
                'engine': function(options) {
                    return new engine(options);
                },
                'timer': function (options) {
                    return new timer(options);
                },
                'countdown': function (options) {
                    return new countdown(options);
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