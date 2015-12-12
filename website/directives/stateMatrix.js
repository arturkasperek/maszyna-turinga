angular.module('turingApp')
    .directive('stateMatrix', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'stateMatrix.html',
            scope: {
                stateMatrix: '=',
                symbols: '='
            },
            link: function($scope) {

            }
        }
});