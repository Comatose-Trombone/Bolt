angular.module('bolt.createProfile', ['bolt.auth'])
// This controller is tied to 'createProfile.html'
.controller('CreateProfileController', function ($location, $scope, Profile, $window, Auth) {
  // Define inputData object to store the user's data
  $scope.inputData = {};
  // This will be the mechanism by which profiles are created / updated. It
  // will set the new data to $scope (so it's accessible to other controllers)
  // and update the user in our Mongo DB
  $scope.session = $window.localStorage;

  $scope.createProfile = function (inputData) {

    if (inputData.phone) {
      // DB expects a number
      inputData.phone = inputData.phone.replace(/[^0-9]/g, '');
    }
    $location.path('/profile');

    var updateUser = {
      $set: inputData
    };

    Profile.updateUserInfo(updateUser, this.session.username)
    .then( function (data) {
      for (var key in inputData) {
        $window.localStorage.setItem(key, data.data[key]);
      }
    })
    .catch( function (err) {
      console.log('err', err);
    });
  };


  // Give signout ability to $scope
  $scope.signout = function () {
    Auth.signout();
  };
});
