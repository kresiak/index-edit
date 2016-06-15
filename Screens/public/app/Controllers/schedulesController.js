'use strict';

app.controller("schedulesController", function ($scope, dataService, $filter) {

    var tablename = 'schedules';
    // inherits $scope.filesInDb

    var initDBSchedules = function () {
        return dataService.crudGetRecords(tablename)
            .then(function (response) {
                $scope.schedules = response.data;
                $scope.schedules.forEach(function(schedule) {
                    if (schedule.data.once.date) schedule.data.once.date = new Date(schedule.data.once.date);
                    if (schedule.data.validity.dateStart) schedule.data.validity.dateStart = new Date(schedule.data.validity.dateStart);
                    if (schedule.data.validity.dateEnd) schedule.data.validity.dateEnd = new Date(schedule.data.validity.dateEnd);
                });
            });
    };
    initDBSchedules();


    var initEmptyScheduleElement = function () {
        $scope.newSchedule = {
            id: "", data: {
                name: '', type: 'once', typeForDay: 'hourlyForDay',
                once: {}, daily: { frequency: 1 }, weekly: { frequency: 1 }, monthly: { frequency: 'premier' }, monthlyii: { frequency: 1 },
                onceForDay: {}, minutelyForDay: {}, hourlyForDay: {}, validityinday: {}, validity: { dateStart: new Date() }
            }
        };
        $scope.scheduleselected = $scope.newSchedule;
    }
    initEmptyScheduleElement();

    $scope.saveSchedule = function () {
        var schedule = $scope.scheduleselected;
        //schedule.data.once.date = $filter('date')(schedule.data.once.date, 'MM/dd/yyyy');
        if (schedule && schedule.data && !String.IsNullOrEmpty(schedule.data.name)) {
            var func = schedule.id
                ? function () { return dataService.crudUpdateRecord(tablename, schedule.id, schedule.data); }
                : function () { return dataService.crudCreateRecord(tablename, schedule.data); };
            func().then(function (response) {
                initDBSchedules();
                initEmptyScheduleElement();
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

    $scope.scheduleSelected = function (schedule) {
        if (!schedule) schedule = $scope.newSchedule;
        $scope.scheduleselected = schedule;
    }

    $scope.isScheduleTheActiveOne = function (schedule) {
        if (!schedule) schedule = $scope.newSchedule;
        return $scope.scheduleselected === schedule;
    }

    $scope.isScheduleNameEmpty = function () {
        return String.IsNullOrEmpty($scope.scheduleselected.data.name.Trim());
    }


    $scope.akdebug = function(value) {
        console.log(value);
    }

});

