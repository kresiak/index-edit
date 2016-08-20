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
                    case 'askName':
                        newState = 'director';
                        break;
                    case 'confirmName':
                        newState = 'askName';
                        break;
                    case 'askEmail':
                        newState = 'confirmName';
                        break;
                    case 'choosePi':
                        newState = 'askEmail';
                        break;
                    case 'userRegistered':
                        newState = 'choosePi';
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
                    case 'director':
                        newState = 'askName';
                        break;
                    case 'askName':
                        newState = 'confirmName';
                        break;
                    case 'confirmName':
                        newState = 'askEmail';
                        break;                       
                    case 'askEmail':
                        newState = 'choosePi';
                        break;
                    case 'choosePi':
                        newState = 'userRegistered';
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