(function() {
    "use strict";
    angular.module('turingApp', [])
        .controller('MainController', function($scope) {
            var that = this,
                stateNumber = 5;

            this.availableChars = '';
            this.stateMatrix = [];
            this.symbols = [];

            function initMachine() {
                if(that.availableChars.length <= 0) {
                    throw new Error("Musisz podać znaki !!!");
                } else {
                    that.stateMatrix = [];
                    that.symbols = [];

                    //generate table header
                    for(var i = 0; i < that.availableChars.length; i++) {
                        that.symbols.push(that.availableChars[i]);
                    }

                    for(var i = 0; i < stateNumber; i++) {
                        var state = {
                            fields: [],
                            stateName: stateNumber
                        };

                        for(var j = 0; j < that.availableChars.length; j++) {
                            var field = new Field('N', that.availableChars[j], stateNumber + 1);

                            field.showEditMode = false;

                            state.fields.push(field);
                        }
                        that.stateMatrix.push(state);
                    }
                }
                console.log(that.stateMatrix);
            }

            //TODO http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field

            $scope.initMachine = function() {
                try {
                    initMachine();
                } catch(e) {
                    alert(e);
                }
            }

            $scope.startEditMode = function(field) {
                field.showEditMode = true;
            };

            $scope.editComplete = function(field) {
                field.showEditMode = false;

            }
        });
})();