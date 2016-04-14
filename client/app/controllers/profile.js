// This controller is tied to profile.html
angular.module('bolt.profile', ['bolt.auth'])

.controller('ProfileController', function ($scope, $location, $rootScope, $window, Auth, Profile) {
  $scope.newInfo = {};
  $scope.session = window.localStorage;
  $scope.showFriendInputForm = false;
  $scope.error = "";

  var getUserInfo = function () {
    Profile.getUser()
    .catch(function (err) {
      console.error(err);
    });
  };

  $scope.navigate = function (path) {
    $location.path(path);
  };

  $scope.signout = function () {
    Auth.signout();
  };

  $scope.toggleFriendInputForm = function () {
    $scope.inputFriendUsername = '';
    $scope.showFriendInputForm = !$scope.showFriendInputForm;
    $scope.error = "";
  };

  $scope.friendRequest = function (inputFriendUsername) {
    var username = $window.localStorage.getItem('username');
    // use the profile service to send a POST request
    Profile.sendFriendRequest(username, inputFriendUsername)
    .then(function (data) {
      if ( data === 'User does not exist' || data === 'You have already sent this user a friend request' ) {
        $scope.error = data;
      } else if ( data.data === 'You are already friends with this user' ) {
        // for some reason, data is sometimes sent back as an object, rather than a string.
        $scope.error = data.data;
      } else {
        $scope.toggleFriendInputForm();
      }
    });
  };


  getUserInfo();
});









