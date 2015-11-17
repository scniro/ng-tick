function init() {

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

                        var eng = new engine();

                        scope.start = function () {
                            eng.start(100).on(function (interval) {
                                var date = scope.offset ? new Date(Date.now() + offset) : new Date();

                                scope.format ? elem.text(filter(date, scope.format)) : elem.text(date);
                            });
                        }

                        scope.$on('$destroy', function () {

                            if (scope.handle && clock.ticking)
                                scope.$root[scope.handle].$emit(scope.handle + ':stop');

                            eng.stop();
                        });

                        if (!scope.trigger)
                            scope.start();
                    }
                }
            }
        ])
        .directive('timer', [
            '$filter', 'tick', function ($filter, tick) {
                return {
                    scope: {
                        format: '@',
                        handle: '@timer',
                        trigger: '='
                    },
                    link: function (scope, elem, attrs) {

                        var relative = $filter('relativeTime');

                        var filter = $filter('date');

                        if (scope.handle)
                            scope.$root[scope.handle] = scope;

                        var timer = tick.timer({
                            onTick: function (ms) {
                                var time = relative(ms);
                                time = scope.format ? filter(time, scope.format) : time;
                                elem.text(time);
                            },
                            onLap: function (lap, ms, status) {
                                if (scope.handle && status.running)
                                    scope.$root[scope.handle].$emit(scope.handle + ':lap', { 'lap': lap, 'elapsed': ms }, status);
                            },
                            onStart: function (status) {
                                if (scope.handle && status.running)
                                    scope.$root[scope.handle].$emit(scope.handle + ':start', status);
                            },
                            onStop: function (status) {
                                if (scope.handle && !status.running)
                                    scope.$root[scope.handle].$emit(scope.handle + ':stop', status);
                            },
                            onReset: function (status) {
                                if (scope.handle)
                                    scope.$root[scope.handle].$emit(scope.handle + ':reset', status);
                            }
                        });

                        scope.start = function () {
                            timer.start();
                        }

                        scope.stop = function () {
                            timer.stop();
                        }

                        scope.reset = function () {
                            timer.reset();
                        }

                        scope.lap = function () {
                            timer.lap();
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
        .factory('tick', function (tickHelper, engine) {

            function timer(options) {

                options = options || {};
                var eng = new engine();
                var self = this;
                var circuit = 0;
                var lapped = 0;
                var time;

                eng.on(function (interval) {
                    time += interval;
                    lapped += interval;
                    self.onTick(time);
                });

                this.onTick = options.onTick || function () { };
                this.onLap = options.onLap || function () { };
                this.onStart = options.onStart || function () { };
                this.onStop = options.onStop || function () { };
                this.onReset = options.onReset || function () { };

                function lap() {
                    if (eng.status().running) {
                        lap = true;
                        circuit += 1;
                        self.onLap(circuit, lapped, eng.status());
                        lapped = 0;
                    }
                }

                function reset() {
                    time = 0;
                    self.onTick(time);
                    eng.stop();
                    self.onReset(eng.status());
                }

                function start() {
                    if (!eng.status().running) {
                        time = time > 0 ? time : 0;
                        eng.start(options.interval);
                        self.onStart(eng.status());
                    }
                }

                function stop() {
                    if (eng.status().running) {
                        eng.stop();
                        self.onStop(eng.status());
                    }
                }

                return {
                    lap: lap,
                    reset: reset,
                    start: start,
                    stop: stop
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
                }
            }
        })
        .factory('engine', function () {

            var engine = function () {

                var time, thread, begin, interval;
                var self = this;
                self.running = false;

                function on(cb) {
                    self.on = cb || function () { };
                }

                function tick() {
                    if (self.running) {
                        time += interval;
                        if (self.on)
                            self.on(interval);
                        var diff = (Date.now() - begin) - time;
                        setTimeout(tick, (interval - diff));
                    }
                }

                function start(intv) {
                    interval = intv || 10;
                    begin = Date.now();
                    time = 0;
                    self.running = true;
                    thread = setTimeout(tick, interval);

                    return this;
                }

                function stop() {
                    clearTimeout(thread);
                    self.running = false;
                }

                function status() {
                    return {
                        running: self.running,
                        timeoutThread: thread
                    }
                }

                return {
                    on: on,
                    start: start,
                    stop: stop,
                    status: status
                }
            }

            return engine;
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