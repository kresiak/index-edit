'use strict';
app.factory('dataService', ['configService', '$http', function (configService, $http) {
    var dataServicefactory = {};
    var resultObject = {};

    var urlprefix = configService.getServerPath();

    function getFileList() 
    {

        var loadDataFromServer = function () { // returns a promise
            return $http.get(urlprefix + 'files');
        }

        return loadDataFromServer();
    }

    function getResult() {
        return resultObject;
    }

    function crudCreateRecord(table, record) {
        return $http.post(urlprefix + table, record);
    }

    function crudUpdateRecord(table, id, record) {
        return $http.put(urlprefix + table + '/' + id, record);
    }

    function crudGetRecords(table) {
        return $http.get(urlprefix + table);
    }


    dataServicefactory.getResult = getResult;
    dataServicefactory.getFileList = getFileList;
    dataServicefactory.crudCreateRecord = crudCreateRecord;
    dataServicefactory.crudGetRecords = crudGetRecords;
    dataServicefactory.crudUpdateRecord = crudUpdateRecord;


    return dataServicefactory;
}]);