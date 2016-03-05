angular.module('bolt.challenges', [])

.controller('challengesController', function ($scope, $location, $window, $http) {
  $scope.challenges = [];
  $scope.session = $window.localStorage;
  $scope.challengeShow;
  
  

  $scope.challengeRunStart = function (index) {
    var challengeInfo = $scope.challenges[index];

    $window.localStorage.setItem('challengeStartLat', challengeInfo.startLocation.latitude);
    $window.localStorage.setItem('challengeStartLng', challengeInfo.startLocation.longitude);
    $window.localStorage.setItem('challengeEndLat', challengeInfo.endLocation.latitude);
    $window.localStorage.setItem('challengeEndLng', challengeInfo.endLocation.longitude);
    $window.localStorage.setItem('timeToBeat', challengeInfo.actualTime.slice(14,22));
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
      console.log("challenge is" , $scope.challenges)
      if ($scope.challenges.length === 0) {
      $scope.challengeShow = false;
      } else {
      $scope.challengeShow = true;
  }
    });
  };

  fetchChallenges($scope.session.username);
});