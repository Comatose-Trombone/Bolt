

angular.module('bolt.controller', [])

.controller('BoltController', function ($scope, $location, $window, $interval, Profile) {
  $scope.session = $window.localStorage;
  $scope.friendRequests = [];
  $scope.challengeList = [];
  var checkForFriendRequests = function () {
    Profile.getUser()
    .then(function (user) {
      // set friend and challenge requests
      $scope.friendRequests = user.friendRequests;
      $scope.challengeList = user.challengeList;

      var friendIcon = document.getElementsByClassName("friendIcon")[0];
      if ( friendIcon ) {
        if ( $scope.friendRequests.length > 0 || $scope.challengeList.length > 0) {
          // change the color of the icon to green
          friendIcon.classList.add("activeFriendIcon");
        } else {
          // change the color of the icon to white, if it was green
          if ( friendIcon.classList.contains("activeFriendIcon" )) {
            friendIcon.classList.remove("activeFriendIcon");
          }
        };
      };
    });
  };
  // run the check for friend requests every 1.5 seconds
  checkForFriendRequests();
  var checkFriendRequestsInterval = $interval(function () {
    checkForFriendRequests();
  }, 1500);

  $scope.startRun = function () {
    // Check which radio button is selected
    if (document.getElementById("switch_3_left").checked) {
      // Solo run
      $location.path('/run');
    } else if (document.getElementById("switch_3_center").checked) {
      $location.path('/friendList');
    } else {
      // Public run
      $location.path('/multiLoad');
    }
  };

  // when you click on the friends icon, trigger the dropdown menu dropdown
  $scope.dropDown = function () {
    $( document ).ready(function () {
      $(".dropdown-button").dropdown();
    });
  };

  // either accept or reject a friend request
  $scope.handleFriendRequest = function (action, newFriend) {
    Profile.handleFriendRequest(action, this.session.username, newFriend)
    .then(function (data) {
      console.log('data', data);
    });
  };

  $scope.handleLiveChallengeRequest = function (action, opponent) {
    var currentChallenge = {
      challenger: "",
      match: false,
      cancel: false };
    // edit the currentChallenge object in user
    if ( action === 'accept' ) {
      currentChallenge.match = true;
      currentChallenge.challenger = opponent;
    }

    var updateUser = {
      $pull: {challengeList: opponent},
      $set: {currentChallenge: currentChallenge}
    };

    Profile.updateUserInfo(updateUser, this.session.username)
    .then(function (data) {
      if ( action === 'accept' ) {
        window.localStorage.setItem("friendOpponent", opponent);
        // $location.path("/multiLoad");
      }
    });
  };

  $scope.$on('$destroy', function () {
    $interval.cancel(checkFriendRequestsInterval);
  });
});

