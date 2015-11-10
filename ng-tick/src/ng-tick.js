function init() {

    angular.module('ngTick', [])
        .directive('clock', [
            '$filter', function ($filter) {

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
                    }

                    scope.stop = function () {

                        if (scope.handle && timer.ticking)
                            scope.$root[scope.handle].$emit(scope.handle + ':stop');

                        timer.stop();
                    }

                    scope.reset = function () {

                        if (scope.handle)
                            scope.$root[scope.handle].$emit(scope.handle + ':reset');

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

                        scope.start = function () {
                            countdown.start(scope.duration);
                        }

                        if (!scope.trigger)
                            scope.start();

                        //console.log('countdown');

                        //if (scope.handle)
                        //    scope.$root[scope.handle] = scope;

                        //var filter = $filter('date');

                        //var relative = $filter('relativeTime');

                        //var moment;

                        //var duration = tickHelper.getDuration(JSON.parse(scope.duration.replace(/'/g, '"'))) || 0;

                        //var timer = new Tock({
                        //    countdown: true,
                        //    interval: scope.interval || 1,
                        //    callback: function () {

                        //        moment = timer.lap();

                        //        var round = scope.interval ? (Math.ceil(timer.lap() / scope.interval) * scope.interval) >= 0 ? Math.ceil(timer.lap() / scope.interval) * scope.interval : 0 : timer.lap();

                        //        var time = relative(round);

                        //        time = filter(time, scope.format);

                        //        elem.text(time);
                        //    },
                        //    complete: function () {
                        //        if (scope.handle)
                        //            scope.$root[scope.handle].$emit(scope.handle + ':end');

                        //        moment = null;
                        //    }
                        //});

                        //scope.reset = function () {
                        //    timer.stop();
                        //    timer.reset();
                        //    timer.start(duration);

                        //    if (scope.handle)
                        //        scope.$root[scope.handle].$emit(scope.handle + ':reset');
                        //}

                        //scope.resume = function () {
                        //    if (!timer.go && moment)
                        //        timer.start(moment);

                        //    if (scope.handle)
                        //        scope.$root[scope.handle].$emit(scope.handle + ':resume');
                        //}

                        //scope.start = function () {
                        //    if (!timer.go)
                        //        timer.start(duration);

                        //    if (scope.handle)
                        //        scope.$root[scope.handle].$emit(scope.handle + ':start');
                        //}

                        //scope.stop = function () {
                        //    if (timer.go)
                        //        timer.stop();

                        //    if (scope.handle)
                        //        scope.$root[scope.handle].$emit(scope.handle + ':stop');
                        //}

                        //scope.$on('$destroy', function () {
                        //    timer.stop();
                        //});
                    }
                }
            }
        ])
        .directive('binaryClock', [
            '$timeout', function ($timeout) {
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
                var start;
                var time;
                var interval = options.interval || 10;
                var thread;
                var phantom = 0;
                var lap = false;
                var circuit = 0;
                var lapped = 0;

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
                var thread;
                var interval = options.interval || 10;
                var start;
                var time;
                var from;

                self.ticking = false;

                options = options || {};

                function tick() {
                    time += interval;
                    from -= interval;
                    self.onTick(from);
                    var diff = (Date.now() - start) - time;
                    setTimeout(tick, (interval - diff));
                }

                this.onTick = options.onTick || function () { };

                this.start = function (duration) {

                    from = tickHelper.getDuration(duration) || 0;

                    if (!self.ticking) {
                        time = 0;
                        start = Date.now();
                        self.ticking = true;
                        thread = setTimeout(tick, interval);
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