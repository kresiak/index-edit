'use strict';

app.controller("mainController", function ($scope, dataService, configService) {

    $scope.screenNo = 1;

    dataService.getFileList()
        .then(function () {
            $scope.files = dataService.getResult().map(function(x) {
                return {
                    filename: x,
                    ourname: '',
                    comment: '',
                    activated: true,
                    isOk: function() {
                        return ! String.IsNullOrEmpty(this.ourname.Trim());
                    }
                };
            });
            $scope.msg = '';
        });


    $scope.saveFileList = function () {
        var allOk = true;

        $scope.files.filter(function(x) { return x.isOk(); })
            .forEach(function (element) {
                if (allOk) dataService.crudCreateRecord('fileinfos', element)
                    .then(
                        function(response) {
                            $scope.msg = 'OK';
                        },
                        function(response) {
                            $scope.msg = 'Error in ' + element.filename + ' ' + response;
                            allOk = false;
                        }
                    );
            });
    }

    $scope.getFileUrl= function(filename) {
        var path = configService.getServerPath();
        return path + 'files/' + filename;
    }

    $scope.setTab = function (tabNo) {
        $scope.tabNo = tabNo;
    }

    $scope.getTab = function () {
        return $scope.tabNo;
    }

});


