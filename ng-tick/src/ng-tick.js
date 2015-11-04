angular.module('ngTick', [])
.directive('tick', function ($filter, timeHelper) {
	return {
		scope: {
			tick: '@',
			format: '@',
			from: '='
		},
		link: function (scope, elem, attrs) {

			scope.$root[attrs.handle] = scope;

			var filter = $filter('date');

			var relative = $filter('relativeTime');

			function clock() {
				var start = new Date().getTime();

				var timer = new Tock({
					callback: function () {

						var tick = timer.lap();

						var date = new Date(start + tick);

						scope.format ? elem.text(filter(new Date(date), scope.format)) : elem.text(new Date(date));
					}
				});

				timer.start();
			}

			function countdown() {

				function onCountDownEnd() {
					console.log('end');
				}

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
					complete: onCountDownEnd
				});

				var diff = timeHelper.getTimeOffset(scope.from);

				timer.start(9045000); // 2h, 45m, 30s;
			}

			function ticker() {

				var timer = new Tock({
					callback: function () {

						var time = relative(timer.lap());

						time = filter(time, scope.format);

						elem.text(time);
					}
				});

				timer.start();
			}

			scope.start = function () {
				switch (scope.tick.toLowerCase()) {
					case 'clock': clock(); break;
					case 'countdown': countdown(); break;
					case 'ticker': ticker(); break;
				}
			}

			scope.start();
		}
	}
})
.factory('timeHelper', function () {

	function getTimeOffset(chunk) {
		console.log(chunk);
	}

	return {
		'getTimeOffset': getTimeOffset
	}
})
.filter('relativeTime', [function () {
	return function (ms) {
		return new Date(1970, 0, 1).setMilliseconds(ms);
	};
}])