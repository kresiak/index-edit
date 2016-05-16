'use strict';

app.controller("sequencesController", function ($scope, dataService, configService, $q) {

    var tablename = 'sequences';
    // inherits $scope.filesInDb

    var initDBSequences = function () {
        return dataService.crudGetRecords(tablename)
            .then(function (response) {
                $scope.sequences = response.data;
            });
    };
    initDBSequences();


    var initEmptySeqElement= function() {
        $scope.newSequence = { id: "", data: { name: '', files: [] } };
        $scope.seqselected = $scope.newSequence;
    }
    initEmptySeqElement();
    


    $scope.getFileInfoById= function(id) {
        var list = $scope.filesInDb.filter(function(file) {
            return file.id === id;
        });

        if (list.length !== 1) throw 'file info not found: unknown id';

        return list[0];
    }

    $scope.getCandidateFiles = function (currentSeq) {
        if (!$scope.filesInDb) return [];

        return $scope.filesInDb.filter(function (fileInDbInfo) {
            return !currentSeq || currentSeq.data.files.indexOf(fileInDbInfo.id) < 0;
        });
    }

    $scope.saveSequence = function () {
        var seq = $scope.seqselected;
        if (seq && seq.data && ! String.IsNullOrEmpty(seq.data.name)) {
            var func = seq.id
                ? function() { return dataService.crudUpdateRecord(tablename, seq.id, seq.data); }
                : function () { return dataService.crudCreateRecord(tablename, seq.data); };
            func().then(function(response) {
                initDBSequences();
                initEmptySeqElement();
                $scope.sequenceFileIdSelected = null;
                $scope.candidateFileIdSelected = null;
            }, function (response) { });
        }       
    }

    // ============
    // Handle Tabs
    // ============

    $scope.tabNo = 0;

    $scope.setTab = function (tabNo) {
        $scope.tabNo = tabNo;
    }

    $scope.getTab = function () {
        return $scope.tabNo;
    }

    // =====================
    // Handle Selcted items
    // =====================

    $scope.sequenceFileIdSelected = null;
    $scope.candidateFileIdSelected = null;

    $scope.sequenceSelected= function(seq) {
        if (!seq) seq = $scope.newSequence;
        $scope.seqselected = seq;
        $scope.sequenceFileIdSelected = null;
        $scope.candidateFileIdSelected = null;
    }

    $scope.isSequenceTheActiveOne= function(seq) {
        if (!seq) seq = $scope.newSequence;
        return $scope.seqselected === seq;
    }

    $scope.sequenceFileSelected= function(fileid) {
        $scope.sequenceFileIdSelected = fileid;
    }

    $scope.isSequenceFileTheActiveOne= function(fileid) {
        return $scope.sequenceFileIdSelected === fileid;
    }

    $scope.candidateFileSelected = function (fileinfo) {
        $scope.candidateFileIdSelected = fileinfo;
    }

    $scope.isCandidateFileTheActiveOne = function (fileinfo) {
        return $scope.candidateFileIdSelected === fileinfo;
    }

    $scope.isSequenceNameEmpty= function() {
        return String.IsNullOrEmpty($scope.seqselected.data.name.Trim());
    }

    //===================
    // Handle images cmd
    //===================

    $scope.addCurrentImageToSelection= function () {
        var imageId = $scope.candidateFileIdSelected.id;
        $scope.seqselected.data.files.push(imageId);
        $scope.candidateFileIdSelected = null;
    }

    $scope.removeCurrentImageFromSelection = function () {
        var imageId = $scope.sequenceFileIdSelected;
        var index = $scope.seqselected.data.files.indexOf(imageId);
        $scope.seqselected.data.files.splice(index, 1);
        $scope.sequenceFileIdSelected = null;
    }

    $scope.MoveUpCurrentImageInSelection = function () {
        var imageId = $scope.sequenceFileIdSelected;
        var list = $scope.seqselected.data.files;
        var index = list.indexOf(imageId);
        if (index < list.length - 1) {
            var saved = list[index];
            list[index] = list[index + 1];
            list[index + 1] = saved;
        }
    }

    $scope.MoveDownCurrentImageInSelection = function () {
        var imageId = $scope.sequenceFileIdSelected;
        var list = $scope.seqselected.data.files;
        var index = list.indexOf(imageId);
        if (index > 0) {
            var saved = list[index];
            list[index] = list[index - 1];
            list[index - 1] = saved;
        }
    }

});

