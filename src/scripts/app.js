angular
  .module('TodoApp', [
    'ngRoute',
    'LoginController'
  ])
  .config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: '/partials/login-controller.html',
          controller: 'LoginController',
        })
        .otherwise('/login');
    }
  ]);
