'use strict';

app.controller("welcomeController",
    function ($scope, transitionService) {
    
    $scope.gotoBack = function () {
        transitionService.goBack();
    }
    
    $scope.gotoNext = function () {
        transitionService.goContinue();
    }
});
