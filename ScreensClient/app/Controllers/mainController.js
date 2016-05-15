'use strict';

app.controller("mainController", function ($scope, dataService, configService) {

    $scope.screenNo = 1;

    dataService.getFileList()
        .then(function() {
            $scope.files = dataService.getResult().map(function(x) {
                return {
                    filename: x,
                    ourname: '',
                    comment: ''
                };
            });
        });


    $scope.getFileUrl= function(filename) {
        var path = configService.getServerPath();
        return path + 'files/' + filename;
    }
});


