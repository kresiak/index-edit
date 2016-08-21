'use strict';

app.controller("presentationController",
    function ($scope, $stateParams, dataService, $rootScope, $state) {
    
    var id = $stateParams.presentationId;
    $rootScope.UserId = $stateParams.UserId;
    
    $scope.isLoaded = false;
    
    dataService.crudGetRecordById('Presentations', id).then(
        function (response) {
            $rootScope.presentation = response.data;
            $scope.isLoaded = true;
        }
    );
    
    $scope.gotoExam = function () {
        $state.go('examen');
    }
    
});
