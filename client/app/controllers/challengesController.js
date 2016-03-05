angular.module('bolt.challenges', [])

.controller('challengesController', function ($scope, $location, $window, $http) {
	$scope.challenges = [];
  $scope.session = $window.localStorage;

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