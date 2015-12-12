angular.module('turingApp')
    .directive('state', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'state.html',
            scope: {
                stateName: '=',
                fields: '='
            },
            link: function() {

            }
        }
});