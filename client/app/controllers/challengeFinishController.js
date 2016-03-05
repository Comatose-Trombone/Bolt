angular.module('challengefinish.controller', [])
  // This controller is responsible for the finish.html view
  .controller('ChallengeFinishController', function ($scope, $location, $route, $window, $rootScope) {
    // This will set the route to the main /bolt page and give the access
    // to $scope
    $scope.winner = $rootScope.challengeWinner;
    $scope.challengeRace = $window.localStorage.challengeStartLat.length > 0;


    // Reset challenge race info on session
    $window.localStorage.setItem('challengeStartLat', "");
    $window.localStorage.setItem('challengeStartLng', "");
    $window.localStorage.setItem('challengeEndLat', "");
    $window.localStorage.setItem('challengeEndLng', "");

});
