// This controller is tied to achievements.html
angular.module('achievements.controller', [])
  .controller('AchievementsController', function ($scope, $window,Profile) {
    var session = $window.localStorage;
    var medals = JSON.parse(session.achievements);
    $scope.total = medals['Gold'] + medals['Silver'] + medals['Bronze'] + medals['High Five'];
    $scope.runs;
    $scope.showDetails = false;
    $scope.theRun;
    var mainMap;
    var currentLocMarker;
    var destinationMarker;
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var route;
    // Use numeric strings for medal counts to display in d3
    var makeStaticMap = function (run) {
      var startLoc = run.startLocation;
      var endLoc = run.endLocation;

      mainMap = new google.maps.Map(document.getElementById('static-map'), {
        center: new google.maps.LatLng(startLoc.latitude, startLoc.longitude),
        zoom: 10,
        disableDefaultUI: true
      });

      directionsRenderer.setMap(mainMap);

      var startOfRoute = new google.maps.LatLng(startLoc.latitude, startLoc.longitude);
      var endOfRoute = new google.maps.LatLng(endLoc.latitude, endLoc.longitude);

      route = directionsService.route({
        origin: startOfRoute,
        destination: endOfRoute,
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        provideRouteAlternatives: false
      }, function (response, status) {
        directionsRenderer.setDirections(response);
      });
    };

    $scope.toggleShowDetails = function (run) {
      $scope.showDetails = !$scope.showDetails;
      $scope.theRun = run;
      makeStaticMap(run);
    };

    var medalCounts = [
      medals['Gold'].toString(),
      medals['Silver'].toString(),
      medals['Bronze'].toString(),
      medals['High Five'].toString()
    ];
    //Gets the user's run
     $scope.getUserRun = function () {
      Profile.getUser()
      .then(function (user) {
        $scope.runs = user.runs;
        console.log("$scope.runs are: ", $scope.runs);
      });
    };
    $scope.getUserRun();

    // Animates display of medal counts
    $scope.incrementCounts = function (width) {
      selection = d3.select('body')
        .selectAll('span.number')
        .data(medalCounts);
      selection.transition()
      .tween('html', function (d) {
        var i = d3.interpolate(this.textContent, d);
        return function (t) {
          this.textContent = Math.round(i(t));
        };
      })
      .duration(1500)
      .style('width', width + 'px');
    };

    setTimeout(function () {
      $scope.incrementCounts();
      }, 500);

  });
