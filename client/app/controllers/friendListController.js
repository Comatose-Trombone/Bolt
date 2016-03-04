angular.module('bolt.friendList', [])

.controller('friendListController', function ($scope, Profile) {
  $scope.friends = [];

  Profile.getFriends()
  .then(function (friends) {
    $scope.friends = friends.data;
    console.log($scope.friends);
  });
});