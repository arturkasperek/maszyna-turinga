(function() {
    "use strict";
    angular.module('turingApp', [])
        .controller('MainController', function($scope) {
            var that = this,
                stateNumber = 5;

            this.availableSymbols = '';
            this.stateMatrix = [];
            this.symbols = [];

            function initMachine() {
                if(that.availableSymbols.length <= 0) {
                    throw new Error("Musisz podać znaki !!!");
                } else {
                    that.stateMatrix = [];
                    that.symbols = [];

                    //generate table header
                    for(var i = 0; i < that.availableSymbols.length; i++) {
                        that.symbols.push(that.availableSymbols[i]);
                    }

                    for(var i = 0; i < stateNumber; i++) {
                        var state = {
                            fields: [],
                            stateName: stateNumber
                        };

                        for(var j = 0; j < that.availableSymbols.length; j++) {
                            var field = new Field('N', that.availableSymbols[j], stateNumber + 1);

                            field.showEditMode = false;

                            state.fields.push(field);
                        }
                        that.stateMatrix.push(state);
                    }
                }
            }

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