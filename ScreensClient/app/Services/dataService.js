'use strict';
app.factory('dataService', ['configService', '$http', function (configService, $http) {
    var dataServicefactory = {};
    var resultObject = {};

    var urlprefix = configService.getServerPath();

    function getFileList() 
    {

        var loadDataFromServer = function () { // returns a promise
            return $http.get(urlprefix + 'files')
            .success(function (response) {
                    resultObject = response;
            })
            .error(function (data, status, headers, config) {

            });
        }

        return loadDataFromServer();
    }

    function getResult() {
        return resultObject;
    }

    dataServicefactory.getResult = getResult;
    dataServicefactory.getFileList = getFileList;

    return dataServicefactory;
}]);