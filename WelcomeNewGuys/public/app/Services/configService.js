'use strict';
app.factory('configService', ['$location', function ($location) {

    var getServerPath = function () {
        var urlprefix = 'http://localhost:1337/data/';
        return urlprefix;
    }

    var configServiceFactory = {};

    configServiceFactory.getServerPath = getServerPath;
    return configServiceFactory;
}]);