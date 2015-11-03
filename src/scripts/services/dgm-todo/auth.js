angular
  .module('dgmTodo.auth', [
    'dgmTodo'
  ])
  .factory('auth', [
    '$http',
    'dgmTodoHost',
    function($http, host) {
      var auth = {
        login: function(email, password) {
          return $http
            .post(host + '/session', {
              email: email,
              password: password,
            });
        }
      };

      return auth;
    },
  ]);
