var app = angular.module('AuthApp', []);

app.controller('AuthController', function($scope) {
  $scope.isLogin = false;
  $scope.user = {};
  $scope.loginData = {};
  $scope.registeredUsers = [];
  $scope.message = "";

  $scope.toggleView = function() {
    $scope.isLogin = !$scope.isLogin;
    $scope.message = "";
    $scope.user = {};
    $scope.loginData = {};
  };

  $scope.register = function() {
    
    var existingUser = $scope.registeredUsers.find(function(u) { return u.username === $scope.user.username; });
    if (existingUser) {
      $scope.message = "Username already exists!";
      return;
    }

    $scope.registeredUsers.push({
      firstName: $scope.user.firstName,
      lastName: $scope.user.lastName,
      username: $scope.user.username,
      password: $scope.user.password
    });

    $scope.message = "Registration successful! Please login.";
    $scope.toggleView();
  };

  $scope.login = function() {
    var user = $scope.registeredUsers.find(function(u) {
      return u.username === $scope.loginData.username && u.password === $scope.loginData.password;
    });

    if (user) {
      $scope.message = "Welcome, " + user.firstName + "!";
    } else {
      $scope.message = "Invalid username or password.";
    }
  };
});
