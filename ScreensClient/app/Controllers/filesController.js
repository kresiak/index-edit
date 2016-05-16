'use strict';

app.controller("filesController", function ($scope, dataService, configService, $q) {

    $scope.screenNo = 1;
    $scope.viewType = '1';

    var tablename = 'fileinfos';

    function FileInfo(id, filename, ourname, comment, duration, activated) {
        if (id) this.id = id;
        this.filename = filename;
        this.ourname = ourname;
        this.comment = comment;
        this.duration = duration;
        this.activated = activated;
    }

    FileInfo.prototype.isOk = function () {
        return !String.IsNullOrEmpty(this.ourname.Trim());
    }

    function initFiles() {
        dataService.getFileList()
            .then(function (response) {
                var filesInDir = response.data.map(function (filename) { return new FileInfo(undefined, filename, '', '', '', true); });

                dataService.crudGetRecords(tablename).then(function (response) {
                    var filesInDb = response.data.map(function (filerecord) {
                        return new FileInfo(filerecord.id, filerecord.data.filename, filerecord.data.ourname, filerecord.data.comment, filerecord.data.duration, filerecord.data.activated);
                    });

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


