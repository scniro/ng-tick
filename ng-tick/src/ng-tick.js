angular.module('ngTick', [])

.directive('clock', function ($filter) {

	return {
		scope: {
			format: '@',
			handle: '@clock',
			trigger: '='
		},
		link: function (scope, elem, attrs) {

			if(scope.handle)
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
				if(!timer.go)
					timer.start();
			}

			if(!scope.trigger)
				scope.start();
		}
	}
})

.directive('ticker', function ($filter) {
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

			var timer = new Tock({
				callback: function () {

					var time = relative(timer.lap());

					time = scope.format ? filter(time, scope.format) : timer.lap();

					elem.text(time);
				}
			});

			scope.start = function () {

				timer.reset();
				timer.start();
			}

			if (!scope.trigger)
				scope.start();
		}
	}
})

.directive('countdown', function ($filter, tickHelper) {
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
})

.factory('tickHelper', function () {

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
})

.filter('relativeTime', [function () {
	return function (ms) {
		return new Date(1970, 0, 1).setMilliseconds(ms);
	};
}])