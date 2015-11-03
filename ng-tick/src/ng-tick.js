angular.module('ngTick', [])
.directive('tick', function () {
	return {
		scope: {
			tick: '@'
		},
		link: function (scope, elem, attrs) {

			scope.$root[attrs.handle] = scope;


			function clock() {
				var start = new Date().getTime();

				var timer = new Tock({
					callback: function () {

						var tick = timer.lap();

						var date = new Date(start + tick);

						elem.text(date);
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
					case 'clock':
						clock();
						break;
					case 'ticker':
						ticker();
						break;
				}

			}

			scope.start();
		}
	}
});