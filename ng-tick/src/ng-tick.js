angular.module('ngTick', [])
.directive('tick', function ($filter) {
	return {
		scope: {
			tick: '@',
			format: '@',
			from: '@'
		},
		link: function (scope, elem, attrs) {

			scope.$root[attrs.handle] = scope;

			var filter = $filter('date');

			function clock() {
				var start = new Date().getTime();

				var timer = new Tock({
					callback: function () {

						var tick = timer.lap();

						var date = new Date(start + tick);

						scope.format ? elem.text(filter(new Date(date.toUTCString()), scope.format)) : elem.text(new Date(date.toUTCString()));
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
					interval: 1000,
					callback: function () {

						var round = (Math.ceil(timer.lap() / 1000) * 1000) >= 0 ? Math.ceil(timer.lap() / 1000) * 1000 : 0;

						elem.text(timer.msToTimecode(round));
					},
					complete: onCountDownEnd
				});

				timer.start(scope.from);
			}

			function ticker() {

				var timer = new Tock({
					callback: function () {

						elem.text(timer.msToTimecode(timer.lap()));
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
});