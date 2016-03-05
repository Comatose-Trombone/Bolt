angular.module('bolt.friendList', [])

.controller('friendListController', function ($scope, Profile, $location, $window, raceFriends) {
  var user = $window.localStorage.username;
  $scope.friends = [];
  $scope.selected = "";

  Profile.getFriends()
  .then(function (friends) {
    $scope.friends = friends.data;
  });

  $scope.selectFriend = function (friend) {
    $scope.selected = friend;
  };

  $scope.isSelected = function (friend) {
    return $scope.selected === friend;
  };

  $scope.raceLive = function () {
    if ( $scope.selected === "" ) {
      console.log('you must choose a friend first');
    } else {
      // add challenge to database
      var opponent = $scope.selected.username;
      raceFriends.submitLiveChallenge(user, opponent)
      .then(function (data) {
        // store the opponent in your session
        $window.localStorage.setItem("friendOpponent", opponent);
        // route to multiLoadController
        $location.path("/multiLoad");
      });
<<<<<<< HEAD
=======
  };

  $scope.sendChallenge = function () {
    if ( $scope.selected === "" ) {
      console.log('you must choose a friend first');
    } else {

    }





      // $location.path('/multiLoad');
>>>>>>> 500f05cb663f20a3dd8c16be4ccf81dc600ccdf4
    };
  };

});