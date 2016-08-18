var app = angular.module('welcomeGuysApp', ['ui.router', 'LocalStorageModule', 'ui.bootstrap']);

app.config([
    '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise('/');
        
        $stateProvider
            .state('michelGeorges',
                {
            url: '/',
            templateUrl: 'App/Views/MichelGeorges.html'    
        })
            .state('askName',
                {
                    url: '/',
                    templateUrl: 'App/Views/AskName.html'
        });
    }
]);




String.IsNullOrEmpty = function (value) {
    if (value) {
        if (typeof (value) == 'string') {
            if (value.length > 0)
                return false;
        }
        if (value != null)
            return false;
    }
    return true;
}

String.prototype.Trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
}
