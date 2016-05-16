'use strict';

app.controller("filesController", function ($scope, dataService, $q) {

    $scope.screenNo = 1;
    $scope.viewType = '1';

    var tablename = 'fileinfos';

    function initFiles() {
        dataService.getFileList()
            .then(function (response) {
                var filesInDir = response.data.map(function (filename) { return new FileInfo(undefined, filename, '', '', '', true); });

                $scope.initDBFiles().then(function (response) {
                    var filesInDb = $scope.filesInDb;

                    var filesInDbUnregistered = filesInDir.filter(function (fileInDir) {  // keep only files in DIR which are not yet in DB
                        return filesInDb.filter(function (fileInDb) {
                            return fileInDb.filename === fileInDir.filename;
                        }).length === 0;
                    });

                    $scope.getFiles = function () {
                        if ($scope.viewType === '0') {
                            return filesInDbUnregistered;
                        } else {
                            return filesInDb;
                        }
                    }

                    $scope.msg = '';
                });

            });
    }

    initFiles();


    $scope.saveFileList = function () {
        var allOk = true;

        var crudPromises = $scope.getFiles().filter(function (x) { return x.isOk(); }).map(function (fileInfo) {
            if ($scope.viewType === '0') return dataService.crudCreateRecord(tablename, fileInfo);
            else return dataService.crudUpdateRecord(tablename, fileInfo.id, fileInfo);
        });

        $q.all(crudPromises).then(
                        function (response) {
                            $scope.msg = 'OK';
                            initFiles();
                        },
                        function (response) {
                            $scope.msg = 'Error';
                            allOk = false;
                        }
            );
    }

    $scope.changeViewType = function (value) {
        $scope.viewType = value;
    }

});


