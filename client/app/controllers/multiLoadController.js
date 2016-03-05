// This controller is tied to multiLoad.html
angular.module('multiload.controller', ['bolt.profile'])

.controller('MultiLoadController', function ($window, $scope, Multi) {
  $scope.session = $window.localStorage;
  $scope.showCancel = false;
  Multi.addUserGeoFire();

  setTimeout( function () {
    $scope.showCancel = true;
  }, 3500);

  $scope.cancelSearch = function () {
    Multi.cancelSearch();
  };
})

.factory('Multi', function ($window, $location, $interval, Profile, MultiGame) {
  // Connect your own firebase account in this line
  var session = $window.localStorage;
  var firebaseRef = new Firebase("https://glowing-fire-8101.firebaseio.com/");
  var geoFire = new GeoFire(firebaseRef);
  var currentUser;
  var userPosition;
  var stop;
  var bool;

  var checkIfFriendCancel = function () {
    Profile.getUser(session.username)
    .then(function (user) {
      console.log('currentChallenge', user.currentChallenge);
      // listen if the other user cancelled/rejected. if so, cancel the search.
      if ( user.currentChallenge.cancel ) {
      // NOTE: you do NOT need to change the cancel status back to false. This is done when you
      // send a challenge request, or when you accept one.
        cancelSearch();
      }
    });
  };

  // Find runners in an area given by the geoQuery object
  var search = function (geoQuery) {
    // if you are waiting for a friend's response to a challenge, need to check if friend cancels.
    if ( session.friendOpponent !== "" ) {
      checkIfFriendCancel();
    }

    if ($location.path() !== "/multiLoad") {
      geoFire.remove(session.username).then(function () {});
      $interval.cancel(stop);
    }

    var onKeyEnteredRegistration = geoQuery.on("key_entered", function (key, location, distance) {
      // need a check to see if friend has declined the request. if so, clean friendOpponent on session, and call cancelSearch.
      // In order to use the same function for friend-friend and friend-public matching, a bool value is used.
      console.log('key,', key);
      console.log(session.friendOpponent);
      if ( session.friendOpponent !== "" ) {
        if ( key === session.friendOpponent ) {
          console.log('hello');
          bool = true;
        }
      } else {
        if ( key !== session.username ) {
          var id = [session.username, key].sort().join('');
        }
      }
      if ( bool ) {
        // This calculation should be placed in a factory
        var destinationLat = (userPosition.coords.latitude + location[0]) / 2;
        var destinationLng = (userPosition.coords.longitude + location[1]) / 2;

        geoFire.remove(key).then(function () {});
        //cancel the search
        $interval.cancel(stop);
        geoQuery.cancel();

        MultiGame.makeGame(id);
        session.gameId = id;
        session.competitor = key;
        session.multiLat = destinationLat;
        session.multiLng = destinationLng;
        $location.path('multiGame');
        return;
      }
    });
  };

  // Create an area in which to search for other users
  var generateQuery = function () {
    console.log('generate query');
    var geoQuery = geoFire.query({
      center: [userPosition.coords.latitude, userPosition.coords.longitude],
      // radius should be reduced to within the users desired distance
      radius: 1000 // miles
    });

    //stop is kind of misnamed here
    stop = $interval(function () {
      search(geoQuery);
    }, 2000);

  };

  // Make user findable in the database
  var addUserGeoFire = function () {
    navigator.geolocation.getCurrentPosition(function (position) {
      userPosition = position;
      // GeoFire.set adds key-location pair to this GeoFire
      // A GeoFire instance is used to read and write geolocation data to your Firebase database and to create queries.
      geoFire.set(session.username, [position.coords.latitude, position.coords.longitude]).then(function () {
        console.log("Provided key has been added to GeoFire");
        generateQuery();
        }, function (error) {
          console.log("Error: " + error);
        });
    }, function (err) {
      console.error(err);
    });
  };

  var cancelSearch = function () {
    // updates the opponent's profile, setting their current match status cancel to true
    // this is necessary when both players are queued, but one player leaves. Must
    // notiffy the other player.

    var currentChallenge = {
      opponent: session.username,
      match: false,
      cancel: true
    };
    var updateUserInfo = {
      $set: { currentChallenge: currentChallenge }
    };
    Profile.updateUserInfo(updateUserInfo, session.opponent);
    $window.localStorage.removeItem("friendOpponent");

    $location.path('/bolt');

    // if two users are loading, and one cancels, it should alert the other person that there was a cancellation.
    // update user
  };

  return {
    search: search,
    generateQuery: generateQuery,
    addUserGeoFire: addUserGeoFire,
    cancelSearch: cancelSearch
    // searchFriend: searchFriend
  };
});
