'use strict';

app.controller("mainController",
    function ($scope, dataService, configService) {

        $scope.getFileUrl = function (filename) {
            var path = configService.getServerPath();
            return path + 'files/' + filename;
        }

        $scope.getFileInfoById = function (id) {
            var list = $scope.filesInDb.filter(function (file) {
                return file.id === id;
            });

            if (list.length !== 1) throw 'file info not found: unknown id';

            return list[0];
        }

        $scope.setTab = function (tabNo) {
            $scope.tabNo = tabNo;
        }

        $scope.getTab = function () {
            return $scope.tabNo;
        }

        var filesTablename = 'fileinfos';

        $scope.initDBFiles = function () {
            return dataService.crudGetRecords(filesTablename)
                .then(function (response) {
                    $scope.filesInDb = response.data.map(function (filerecord) {
                        return new FileInfo(filerecord.id,
                            filerecord.data.filename,
                            filerecord.data.ourname,
                            filerecord.data.comment,
                            filerecord.data.duration,
                            filerecord.data.activated);
                    });
                });
        };

        $scope.initDBFiles();
    });
