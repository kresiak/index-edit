﻿'use strict';

app.controller("pivalidationController",
    function ($scope, $stateParams, dataService, $rootScope, $state, $q) {
    
   
    $scope.isLoaded = false;
    
    var promises = [];

    promises.push(dataService.crudGetRecordById('PIs', $stateParams.piId).then(
        function (response) {
            $scope.pi = response.data;
            $scope.piFullname = $scope.pi.Prenom + ' ' + $scope.pi.Nom;
        }
    ));
    
    promises.push(dataService.crudGetRecordById('Employees', $stateParams.userId).then(
        function (response) {
            $scope.user = response.data;
            $scope.user.piAnswers = $scope.user.piAnswers || {};
            $scope.answersByPi = $scope.user.piAnswers[$stateParams.piId] || {};             
            $scope.answersByPi.allowedPlatforms = $scope.answersByPi.allowedPlatforms || {};
            $scope.answersByPi.allowedFacilities = $scope.answersByPi.allowedFacilities || {};
            
            $scope.userFullname = $scope.user.Prenom + ' ' + $scope.user.Nom;
        }
    ));
        
    promises.push(dataService.crudGetRecords('Platforms').then(
        function (response) {
            $scope.platforms = response.data;
        }
    ));
    
    promises.push(dataService.crudGetRecords('Facilities').then(
        function (response) {
            $scope.facilities = response.data;
        }
    ));
    
    
    $q.all(promises)
            .then(function () {
        $scope.isLoaded = true;
    });
    
    $scope.gotoEnd = function () {
        $scope.answersByPi.dateUpdate = new Date();
        dataService.callWebService('UpdatePiAnswer', {'userId': $stateParams.userId, 'piId': $stateParams.piId, 'piAnswer' : $scope.answersByPi} );
        //$state.go('examen');
    }
    
});
