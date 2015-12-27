(function() {
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
                    var that = this;

                    $scope.symbolPickingActive = '';

                    $scope.statePicked = function(state) {
                        $scope.$broadcast('statePicked', state);
                        $scope.statePickingActive = '';
                    };

                    $scope.symbolPicked = function(symbol) {
                        $scope.$broadcast('symbolPicked', symbol);
                        $scope.symbolPickingActive = '';
                    };

                    $scope.$on('symbolPickingActive', function() {
                        $scope.symbolPickingActive = 'active';
                    });

                    $scope.$on('symbolPickingDeactive', function() {
                        $scope.symbolPickingActive = '';
                    });

                    $scope.$on('statePickingActive', function() {
                        $scope.statePickingActive = 'active';
                    });

                    $scope.$on('statePickingDeactive', function() {
                        $scope.statePickingActive = '';
                    });
                }
            }
    });
})();