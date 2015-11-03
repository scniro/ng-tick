angular.module('ngTick', [])
.directive('tick', function ($timeout) {
	return {
		scope: {
			start: '=',
			end: '='
		},
		link: function (scope, elem, attrs) {

			var delay = 0;

			$timeout(function () {
				(function tick(i) {

					function increment(i) {
						if (++i <= scope.end)
							tick(i);
					}

					function decrement(i) {
						if (--i <= scope.start && --i >= scope.end)
							tick(i);
					}

					setTimeout(function () {
						elem.text(i);
						scope.start < scope.end ? increment(i) : decrement(i);
					}, delay);
				})(scope.start);
			});
		}
	}
});