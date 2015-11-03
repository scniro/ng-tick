angular.module('ngTick', [])
.directive('tick', function ($filter) {
	return {
		scope: {
			tick: '@'
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

						elem.text(filter(new Date(date), 'MMM dd yyyy hh:mm:ss'));
					}
				});

				timer.start();
			}

			function ticker() {

				var timer = new Tock({
					callback: function () {
						elem.text(timer.lap());
					}
				});

				timer.start();
			}

			scope.start = function () {
				switch (scope.tick.toLowerCase()) {
					case 'clock': clock(); break;
					case 'ticker': ticker(); break;
				}
			}

			scope.start();
		}
	}
});