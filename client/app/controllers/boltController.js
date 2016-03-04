

angular.module('bolt.controller', [])

.controller('BoltController', function ($scope, $location, $window, $interval, Profile) {
  $scope.session = $window.localStorage;
  $scope.friendRequests = [];
  if ( $scope.friendRequests[0] === "" ) {
    // if there are no friend requests, the array will equal [""]. we want it to be []
    $scope.friendRequests.pop();
  }

  // checks every 5 seconds to see if a user has any friend requests
  var checkForFriendRequests = function () {
    Profile.getUser()
    .then(function (user) {
      console.log('foobar');
      $scope.friendRequests = user.friendRequests;
      var friendIcon = document.getElementsByClassName("friendIcon")[0];
      if ( friendIcon ) {
        if ( $scope.friendRequests.length > 0 ) {
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
      // Running with friends has not been implemented yet, this is a
      // placeholder for when this functionality has been developed.
      // For now redirect runners to solo run.
      // $location.path('/run');
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

  $scope.handleFriendRequest = function (action, newFriend) {
    Profile.handleFriendRequest(action, this.session.username, newFriend)
    .then(function (data) {
      console.log('data', data);
    });
  };

  // Stops the interval when you route away from the Profile Page
  $scope.$on('$destroy', function () {
    $interval.cancel(checkFriendRequestsInterval);
  });
});

