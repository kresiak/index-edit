

'use strict';

app.controller("userinfoController",
    function ($scope, $stateParams, dataService, $rootScope, $state) {
    
    $scope.isLoaded = false;
    
    dataService.crudGetRecordById('Employees', $rootScope.user._id).then(
        function (response) {
            $rootScope.user = response.data;
            var firstname = $rootScope.user.Prenom;
            var lastname = $rootScope.user.Nom;
            
            $scope.FullName = firstname + ' ' + lastname;
            
            
            dataService.crudGetRecordById('PIs', $rootScope.user.pi).then(function (response) {
                $scope.pi = response.data;
                
                dataService.crudGetRecords('Presentations').then(
                    function (response) {
                        $rootScope.presentations = response.data;
                        $scope.isLoaded = true;
                    }
                );
            });
        }
    );
    
    
    $scope.gotoLogin = function () {
        
    }
    
    $scope.getPresentationText = function (presentation) {
        if ($rootScope.user.passedExams && $rootScope.user.passedExams[presentation._id]) {
            var result = $rootScope.user.passedExams[presentation._id];
            return presentation.title + ' (' + (result.passed ? 'passed' : 'failed') + ' with a score of ' + result.score + ')';
        } else {
            return presentation.title;
        }

    };

});
