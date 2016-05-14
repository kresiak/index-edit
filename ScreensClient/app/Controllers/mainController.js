'use strict';

app.controller("mainController", function ($scope, dataService, configService) {

    $scope.screenNo = 1;

    dataService.getFileList()
        .then(function() {
            $scope.files = dataService.getResult();
        });


    $scope.getFileUrl= function(filename) {
        var path = configService.getServerPath();
        return path + 'files/' + filename;
    }
});


