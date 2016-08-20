'use strict';

app.controller("mainController",
    function ($state) {
    $state.go('welcome.director');
    //var currentSate = $state.current.name;                


});
