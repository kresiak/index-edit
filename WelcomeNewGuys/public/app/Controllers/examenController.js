'use strict';

app.controller("examenController",
    function ($scope, $stateParams, dataService, $rootScope, $state) {

    $scope.gotoScore = function () {
        var presentation = $rootScope.presentation;
        var nbCorrects = presentation.exam.filter(function (q) { return String(q.correct) === q.givebyUser }).length;
        var nbExiges = presentation.examMinimalScore;
        $rootScope.presentation.passedExam = nbCorrects >= nbExiges;
        $rootScope.presentation.score = nbCorrects + ' / ' + presentation.exam.length;
        $state.go('score');
    }
    
});
