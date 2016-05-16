'use strict';

app.controller("sequencesController", function ($scope, dataService, configService, $q) {
    $scope.tabNo = 1;

    var tablename = 'sequences';
    // inherits $scope.filesInDb

    var initDBSequences = function () {
        return dataService.crudGetRecords(tablename)
            .then(function (response) {
                $scope.sequences = response.data;
            });
    };

    initDBSequences();

    $scope.getFileInfoById= function(id) {
        var list = $scope.filesInDb.filter(function(file) {
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

    $scope.getCandidateFiles = function (currentSeq) {
        if (! $scope.filesInDb) return [];

        return $scope.filesInDb.filter(function(fileInDbInfo) {
            return ! currentSeq || currentSeq.data.files.indexOf(fileInDbInfo.id) < 0;
        });
    }

});

