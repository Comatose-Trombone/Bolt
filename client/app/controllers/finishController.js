angular.module('finish.controller', [])
  // This controller is responsible for the finish.html view
  .controller('FinishController', function ($scope, $location, $route, $window, $rootScope) {
    // This will set the route to the main /bolt page and give the access
    // to $scope
    $scope.winner = $rootScope.winner;
    $scope.challengeRace = $window.localStorage.challengeStartLat.length > 0;
    console.log($scope.winner);
    $scope.raceAgain = function () {
      $route.reload('/bolt');
    };

    // Reset challenge race info on session
    $window.localStorage.setItem('challengeStartLat', "");
    $window.localStorage.setItem('challengeStartLng', "");
    $window.localStorage.setItem('challengeEndLat', "");
    $window.localStorage.setItem('challengeEndLng', "");

    if ( window.localStorage.lostRace ) {
      $scope.endMessage = "Nice Try!";
      window.localStorage.lostRace = false;
    } else {
      $scope.endMessage = "Congrats!";
      window.localStorage.lostRace = false;
    }
});
