'use strict';
app.factory('configService', ['$location', function ($location) {

    var getServerPath = function () {
        //var urlprefix = $location.host() + ($location.port() ? ":" + $location.port() : "");
        var urlprefix = 'http://localhost:3002/data/';
        return urlprefix;
    }

    var configServiceFactory = {};

    configServiceFactory.getServerPath = getServerPath;
    return configServiceFactory;
}]);