angular.module('bolt.challenges', [])

.controller('challengesController', function ($scope, $location, $window, $http) {
  $scope.challenges = [];
  $scope.session = $window.localStorage;

  $scope.challengeRunStart = function (index) {
    var challengeInfo = $scope.challenges[index];
    console.log(challengeInfo);
    $window.localStorage.setItem('challengeStartLat', challengeInfo.startLocation.lat);
    $window.localStorage.setItem('challengeStartLng', challengeInfo.startLocation.lng);
    $window.localStorage.setItem('challengeEndLat', challengeInfo.endLocation.lat);
    $window.localStorage.setItem('challengeEndLng', challengeInfo.endLocation.lng);
    $window.localStorage.setItem('timeToBeat', challengeInfo.actualTime);
    $location.path('/challengerun');
  };

  // TODO: update backend route to use general use function
  var fetchChallenges = function (username) {
    return $http({
      method: 'POST',
      url: '/api/users/challenges',
      data: {
        username: username
      }
    })
    .then( function (res) {
      $scope.challenges = res.data;
    });
  };

  fetchChallenges($scope.session.username);
});