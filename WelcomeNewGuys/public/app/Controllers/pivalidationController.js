'use strict';

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
    
    promises.push(dataService.crudGetRecordById('Employees', $stateParams.UserId).then(
        function (response) {
            $scope.user = response.data;
            $scope.userFullname = $scope.user.Prenom + ' ' + $scope.user.Nom;
        }
    ));
        
    $q.all(promises)
            .then(function () {
        $scope.isLoaded = true;
    });
    
    $scope.gotoEnd = function () {
        //$state.go('examen');
    }
    
});
