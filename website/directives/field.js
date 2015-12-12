(function() {
    angular.module('turingApp')
        .directive('field', function($timeout) {
            return {
                restrict: 'A',
                templateUrl: 'field.html',
                scope: {
                    field: '=fieldObject'
                },
                link: function($scope) {
                    var lastActiveField = undefined;

                    $scope.focusDirectionField = false;

                    $scope.activeEditMode = function(fieldName) {
                        if(fieldName == 'direction') {
                            $scope.showDirectionControl = true;
                        } else {
                            $scope.showDirectionControl = false;
                        }

                        $scope.editMode = true;
                        $scope.focusDirectionField = true;
                        lastActiveField = fieldName;
                    };

                    $scope.turnoffEditMode = function() {
                        $scope.editMode = false;
                    };

                    $scope.changeEditMode = function() {

                    };
                }
            }
    });
})();