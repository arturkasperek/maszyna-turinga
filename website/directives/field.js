angular.module('turingApp')
    .directive('field', function($timeout) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'field.html',
            scope: {
                field: '=field'
            },
            link: function($scope) {
                var switchedToDiffrentField = undefined,
                    lastActiveField = undefined;

                $scope.focusDirectionField = false;

                $scope.activeEditMode = function(fieldNumber) {
                    if(switchedToDiffrentField == undefined || lastActiveField == fieldNumber) {
                        switchedToDiffrentField = false;
                    } else {
                        switchedToDiffrentField = true;
                    }

                    $scope.editMode = true;
                    $scope.focusDirectionField = true;
                    lastActiveField = fieldNumber;
                };

                $scope.turnoffEditMode = function() {
                    $timeout(function() {
                        if(!switchedToDiffrentField) {
                            $scope.editMode = false;
                        } else {
                            switchedToDiffrentField = false;
                        }
                    }, 1);
                };

                $scope.changeEditMode = function() {
                    console.log("afds");
                };
            }
        }
});