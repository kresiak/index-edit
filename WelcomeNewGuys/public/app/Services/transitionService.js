'use strict';
app.factory('transitionService', ['$state', function ($state) {
        
        var transitionServiceFactory = {};
        
        function goBack() {
            var currentSate = $state.current.name;
            switch (currentSate) {
                case 'askName':
                    $state.go('director');
                    break;
                default:
            }            
        }
        
        function goContinue() {
            var currentSate = $state.current.name;
            switch (currentSate) {
                case 'director':
                    $state.go('askName');
                    break;
                default:
            }
            
        }
        
        transitionServiceFactory.goBack = goBack;
        transitionServiceFactory.goContinue = goContinue;
        
        return transitionServiceFactory;
    }]);