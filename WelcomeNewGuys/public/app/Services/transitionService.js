'use strict';
app.factory('transitionService', ['$state', '$rootScope', function ($state, $rootScope) {
        
        var transitionServiceFactory = {};
        var onNavigateFn;
        
        function resetCallbacks() {
            onNavigateFn = function () { return true; };
        }
        
        resetCallbacks();
        
        function goBack() {
            var isTransitionAllowed = onNavigateFn(false);
            
            if (isTransitionAllowed) {
                var currentSate = $state.current.name;                
                var newState = 'unknown';
                
                switch (currentSate) {
                    case 'welcome.askName':
                        newState = 'welcome.director';
                        break;
                    case 'welcome.confirmName':
                        newState = 'welcome.askName';
                        break;
                    case 'welcome.askEmail':
                        newState = 'welcome.confirmName';
                        break;
                    case 'welcome.choosePi':
                        newState = 'welcome.askEmail';
                        break;
                    case 'welcome.userRegistered':
                        newState = 'welcome.choosePi';
                        break;
                    default:
                        return;
                }
                resetCallbacks();
                $state.go(newState);                            
            }
        }
        
        function goContinue() {
            var isTransitionAllowed = onNavigateFn(true);
            
            if (isTransitionAllowed) {
                var currentSate = $state.current.name;
                var newState = 'unknown';
                
                switch (currentSate) {
                    case 'welcome.director':
                        newState = 'welcome.askName';
                        break;
                    case 'welcome.askName':
                        newState = 'welcome.confirmName';
                        break;
                    case 'welcome.confirmName':
                        newState = 'welcome.askEmail';
                        break;                       
                    case 'welcome.askEmail':
                        newState = 'welcome.choosePi';
                        break;
                    case 'welcome.choosePi':
                        newState = 'welcome.userRegistered';
                        break;
                    default:
                        return;
                }
                resetCallbacks();
                $state.go(newState);
            }            
        }
        
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            //var valdatinFnResponse = onNavigateFn();
            //if ((valdatinFnResponse !== true || valdatinFnResponse.error === true)) {
            //    event.preventDefault();
            //    return;
            //}
        });
        
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        });
        
        transitionServiceFactory.goBack = goBack;
        transitionServiceFactory.goContinue = goContinue;
        
        transitionServiceFactory.setOnNavigateCallback = function (onNavigateCb) {
            onNavigateFn = onNavigateCb;
        };
        
        return transitionServiceFactory;
    }]);