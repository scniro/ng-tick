function init() {

    angular.module('ngTick', [])
        .directive('clock', [
            '$filter', 'tick', function ($filter, tick) {
                return {
                    scope: {
                        format: '@',
                        handle: '@clock',
                        interval: '@',
                        offset: '@',
                        trigger: '='
                    },
                    link: function (scope, elem, attrs) {

                        if (scope.handle)
                            scope.$root[scope.handle] = scope;

                        var filter = $filter('date');

                        var clock = tick.clock({
                            interval: scope.interval,
                            offset: scope.offset,
                            onStart: function (status) {
                                if (scope.handle)
                                    scope.$root[scope.handle].$emit(scope.handle + ':start', status);
                            },
                            onTick: function (stamp, status) {
                                var value = scope.format ? filter(new Date(stamp), scope.format) : new Date(stamp);
                                elem[0].value !== undefined ? elem.val(value) : elem.text(value);

                                if (scope.handle)
                                    scope.$root[scope.handle].$emit(scope.handle + ':tick', status);
                            }
                        });

                        scope.start = function () { clock.start(); }

                        scope.$on('$destroy', function () { clock.stop(); });

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
                        interval: '@',
                        trigger: '='
                    },
                    link: function (scope, elem, attrs) {

                        var filters = { date: $filter('date'), relative: $filter('relativeTime') }

                        if (scope.handle)
                            scope.$root[scope.handle] = scope;

                        var timer = tick.timer({
                            onLap: function (lap, ms, status) {
                                if (scope.handle)
                                    scope.$root[scope.handle].$emit(scope.handle + ':lap', { 'lap': lap, 'elapsed': ms }, status);
                            },
                            onReset: function (status) {
                                if (scope.handle)
                                    scope.$root[scope.handle].$emit(scope.handle + ':reset', status);
                            },
                            onStart: function (status) {
                                if (scope.handle)
                                    scope.$root[scope.handle].$emit(scope.handle + ':start', status);
                            },
                            onStop: function (status) {
                                if (scope.handle)
                                    scope.$root[scope.handle].$emit(scope.handle + ':stop', status);
                            },
                            onTick: function (ms) {
                                var relative = filters.relative(ms);
                                var value = scope.format ? filters.date(relative, scope.format) : relative;
                                elem[0].value !== undefined ? elem.val(value) : elem.text(value);
                            }
                        });

                        scope.lap = function () { timer.lap(); }

                        scope.reset = function () { timer.reset(); }

                        scope.start = function () { timer.start(); }

                        scope.stop = function () { timer.stop(); }

                        scope.$on('$destroy', function () { timer.stop(); });

                        if (!scope.trigger)
                            scope.start();
                    }
                }
            }
        ])
        .directive('countdown', [
            '$filter', 'tick', function ($filter, tick) {
                return {
                    scope: {
                        duration: '=',
                        format: '@',
                        handle: '@countdown',
                        interval: '@',
                        trigger: '='
                    },
                    link: function (scope, elem, attrs) {

                        var filters = { date: $filter('date'), relative: $filter('relativeTime') }

                        if (scope.handle)
                            scope.$root[scope.handle] = scope;

                        var countdown = tick.countdown({
                            onEnd: function (status) {
                                if (scope.handle)
                                    scope.$root[scope.handle].$emit(scope.handle + ':end', status);
                            },
                            onReset: function (status) {
                                if (scope.handle)
                                    scope.$root[scope.handle].$emit(scope.handle + ':reset', status);
                            },
                            onStart: function (status) {
                                if (scope.handle)
                                    scope.$root[scope.handle].$emit(scope.handle + ':start', status);
                            },
                            onStop: function (status) {
                                if (scope.handle)
                                    scope.$root[scope.handle].$emit(scope.handle + ':stop', status);
                            },
                            onTick: function (ms) {
                                var relative = filters.relative(ms);
                                var value = scope.format ? filters.date(relative, scope.format) : relative;
                                elem[0].value !== undefined ? elem.val(value) : elem.text(value);
                            }
                        });

                        scope.reset = function () { countdown.reset(scope.duration); }

                        scope.start = function () { countdown.start(scope.duration); }

                        scope.stop = function () { countdown.stop(); }

                        scope.$on('$destroy', function () { countdown.stop(); });

                        if (!scope.trigger)
                            scope.start();
                    }
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
        .factory('tick', ['engine', function (engine) {

            function clock(options) {

                options = options || {};

                var eng = new engine();
                var offset = options.offset ? ((parseInt(options.offset) / 100) * 60 + new Date().getTimezoneOffset()) * 60 * 1000 : 0;
                var self = this;

                eng.on(function (interval) {
                    var stamp = Date.now() + offset;
                    self.onTick(stamp, eng.status());
                });

                self.onStart = options.onStart || function () { };
                self.onTick = options.onTick || function () { };

                function start() {
                    if (!eng.status().running) {
                        eng.start(options.interval);
                        self.onStart(eng.status());
                    }
                }

                function stop() {
                    if (eng.status().running)
                        eng.stop();
                }

                return {
                    start: start,
                    stop: stop
                }
            }

            function countdown(options) {

                options = options || {};

                var eng = new engine();
                var from;
                var self = this;

                eng.on(function (interval) {
                    from -= interval;
                    from >= 0 ? self.onTick(from) : end();
                });

                self.onEnd = options.onEnd || function () { };
                self.onReset = options.onReset || function () { };
                self.onStart = options.onStart || function () { };
                self.onStop = options.onStop || function () { };
                self.onTick = options.onTick || function () { };

                function getDuration(chunk) {

                    var now = new Date();

                    now.setMilliseconds(now.getMilliseconds() + (chunk.ms ? chunk.ms : 0));
                    now.setSeconds(now.getSeconds() + (chunk.s || 0));
                    now.setMinutes(now.getMinutes() + (chunk.m || 0));
                    now.setHours(now.getHours() + (chunk.h || 0));

                    return Math.abs(now - new Date());
                }

                function end() {
                    if (eng.status().running) {
                        eng.stop();
                        self.onEnd(eng.status());
                    }
                }

                function reset(duration) {
                    from = getDuration(duration) || 0;
                    eng.stop();
                    self.onTick(from);
                    self.onReset(eng.status());
                }

                function start(duration) {
                    if (!eng.status().running) {
                        from = from > 0 ? from : getDuration(duration) || 0;
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
                    reset: reset,
                    start: start,
                    stop: stop
                }
            }

            function timer(options) {

                options = options || {};

                var circuit = 0;
                var eng = new engine();
                var lapped = 0;
                var self = this;
                var time;

                eng.on(function (interval) {
                    time += interval;
                    lapped += interval;
                    self.onTick(time);
                });

                self.onLap = options.onLap || function () { };
                self.onReset = options.onReset || function () { };
                self.onStart = options.onStart || function () { };
                self.onStop = options.onStop || function () { };
                self.onTick = options.onTick || function () { };

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
                    eng.stop();
                    self.onTick(time);
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

            return {
                'clock': function (options) {
                    return new clock(options);
                },
                'countdown': function (options) {
                    return new countdown(options);
                },
                'timer': function (options) {
                    return new timer(options);
                }
            }
        }])
        .factory('engine', function () {

            var engine = function () {

                var begin, interval, thread, time;
                var self = this;
                self.running = false;

                function on(cb) {
                    self.on = cb || function () { };
                }

                function start(intv) {
                    interval = intv ? parseInt(intv) : 10;
                    begin = Date.now();
                    time = 0;
                    self.running = true;
                    thread = setTimeout(tick, interval);
                    return this;
                }

                function status() {
                    return {
                        running: self.running,
                        timeoutThread: thread
                    }
                }

                function stop() {
                    clearTimeout(thread);
                    self.running = false;
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

                return {
                    on: on,
                    start: start,
                    status: status,
                    stop: stop
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