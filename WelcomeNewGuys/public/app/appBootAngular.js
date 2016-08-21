var app = angular.module('welcomeGuysApp', ['ui.router', 'LocalStorageModule', 'ui.bootstrap']);

app.config([
    '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise('/');
        
        $stateProvider
            .state('identification',
                {
            url: '/identification',
            templateUrl: 'App/Views/MyGiga/identification.html'
        })
            .state('userinfo',
                {
            url: '/userinfo',
            templateUrl: 'App/Views/MyGiga/userinfo.html'
        })
            .state('presentation',
                {
            url: '/presentation/:presentationId/:UserId',
            templateUrl: 'App/Views/presentation.html'
        })
            .state('examen',
                {
            url: '/examen',
            templateUrl: 'App/Views/examen.html'
        })
            .state('score',
                {
            url: '/score',
            templateUrl: 'App/Views/score.html'
        })
            .state('welcome',
                {
            url: '/welcome',
            templateUrl: 'App/Views/welcome.html'
        })
            .state('welcome.director',
                {
            url: '/',
            templateUrl: 'App/Views/Welcome/pageDirector.html'    
        })
        //    .state('IntroGiga',
        //        {
        //    url: '/IntroGiga',
        //    templateUrl: 'App/Views/Presentations/introGiga.html'
        //})
            .state('welcome.userRegistered',
                {
            url: '/',
            templateUrl: 'App/Views/Welcome/pageUserRegistered.html'
        })
            .state('welcome.choosePi',
                {
            url: '/',
            templateUrl: 'App/Views/Welcome/pageChoosePi.html'
        })
            .state('welcome.askEmail',
                {
            url: '/',
            templateUrl: 'App/Views/Welcome/pageAskEmail.html'
        })
            .state('welcome.confirmName',
                {
            url: '/',
            templateUrl: 'App/Views/Welcome/pageConfirmName.html'
        })
            .state('welcome.askName',
                {
                    url: '/',
                    templateUrl: 'App/Views/Welcome/pageAskName.html'
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

String.IsNullOrTrimEmpty = function (value) {
    if (value) {
        if (typeof (value) == 'string') {
            if (value.Trim().length > 0)
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

String.prototype.IsEmail = function () {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this);
}