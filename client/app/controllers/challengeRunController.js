angular.module('challengerun.controller', [])

.controller('challengeRunController',
  function ($scope, $timeout, $interval, $window,
            $location, $route, soloChallenge, Run, Profile, Geo) {

  $scope.session = $window.localStorage;
  $scope.timeToBeat = $scope.session.timeToBeat;
  $scope.initialLoc = {
    lat: $scope.session.challengeStartLat,
    lng: $scope.session.challengeStartLng
  };
  $scope.userLocation;
  $scope.destination = {
    lat: $scope.session.challengeEndLat,
    lng: $scope.session.challengeEndLng
  };
  $scope.raceStarted;
  $scope.runTime = 0;

  console.log($scope.session);

  $scope.hasHours = false;
  $scope.distanceRun = 0;
  $scope.percentComplete = 0;
  // $scope.inRange = true;

  var withinRangeOfStartPoint = true;
  var startTime;
  var statusUpdateLoop;
  var startLat;
  var startLong;
  var FINISH_RADIUS = 0.0002;
  var START_RADIUS = 0.0002;

  checkIfUserNearStart = $interval(checkNearStartPoint, 300);

  // Update run timer
  var updateTotalRunTime = function () {
    var secondsRan = moment().diff(startTime, 'seconds');
    $scope.runTime = moment().minute(0).second(secondsRan);
  };

  // Start the race: starts race timer and update loop
  $scope.startRun = function () {
    if (withinRangeOfStartPoint) {
      $interval.cancel(checkIfUserNearStart);
      // Simulate finishing run for manual testing
      // setTimeout(finishRun, 4000); // simulate finishing run for manual testing
      startTime = moment();
      $scope.raceStarted = true;
      statusUpdateLoop = $interval(updateStatus, 300);
      // Run.setPointsInTime($scope);
      // Run.setInitialMedalGoal($scope);
      document.getElementById('map').style.height = "80vh";
      document.getElementById('botNav').style.height = "20vh";
    } else {
      // $scope.inRange = false;
      // TODO: Add html that tells user they need to get closer to start point
    }
  };

  // Generate map
  soloChallenge.makeInitialMap($scope, $scope.destination);

  // Handle end run conditions. Update user profile to reflect latest run.
  var finishRun = function () {
    var challengeWon = $scope.runTime <= $scope.timeToBeat;
    var medal = $scope.$parent.achievement = $scope.currentMedal;

    var date = new Date();
    var endLocation = {
      latitude: $scope.destination.lat,
      longitude: $scope.destination.long
    };
    var actualTime = runTime;

    var currentRunObject = {
      date: date,
      startLocation: $scope.initialLoc,
      endLocation: {
        longitude: $scope.destination.long,
        latitude: $scope.destination.lat
      },
      googleExpectedTime: null,
      actualTime: runTime,
      medalReceived: medal,
      racedAgainst: null
    };

    // Update current user's profile
    Profile.getUser()
    .then(function (user) {
      var achievements = user.achievements;
      var previousRuns = user.runs;
      //update achievments object
      achievements[medal] = achievements[medal] + 1;
      $window.localStorage.setItem('achievements', JSON.stringify(achievements));
      //update runs object
      previousRuns.push(currentRunObject);
      updatedAchievementsData = {
        achievements: achievements,
        runs: previousRuns
      };
      Profile.updateUser(updatedAchievementsData, user)
      .then(function (updatedProfile) {
        return updatedProfile;
      })
      .catch(function (err) {
        console.error(err);
      });
    });

    $interval.cancel(statusUpdateLoop);
    $location.path('/finish');
  };

  // Check if user is in close proximity to destination
  var checkIfFinished = function () {
    if ($scope.destination && $scope.userLocation) {
      var distRemaining = Geo.distBetween($scope.userLocation, $scope.destination);
      if (distRemaining < FINISH_RADIUS) {
        finishRun();
      }
    }
  };

  // Check if user is within range of starting point before allowing race to start, to ensure a fair race
  var checkNearStartPoint = function () {
    if ($scope.initialLoc && $scope.userLocation) {
      var distRemaining = Geo.distBetween($scope.userLocation, $scope.initialLoc);
      if (distRemaining < START_RADIUS) {
        withinRangeOfStartPoint = true;
      }
    }
  };

  // Update geographical location and timers. Update progress bar via calculating percentage total route completed.
  var updateStatus = function () {
    soloChallenge.updateCurrentPosition($scope);
    updateTotalRunTime();
    checkIfFinished();
  };

  // Stop geotracker upon canceling run
  // Does this make sure to stop tracking if they close the window? --> all scripts die when the browser is no longer interpreting them
  $scope.$on('$destroy', function () {
    $interval.cancel(statusUpdateLoop);
    $interval.cancel(checkIfUserNearStart);
  });
});
