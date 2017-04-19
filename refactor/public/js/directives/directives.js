angular.module('myApp.directives', ["ngCookies"])

  .directive('adminLogin', ['$rootScope','$cookies','AuthService','flashMessageService','$location',
    function($rootScope, $cookies, AuthService, flashMessageService, $location) {

      return {

        controller: function($scope, $cookies,$rootScope) {
          console.log('Func called in adminLogin ctrl', $cookies.get("loggedInUser"));
          /**
          * For solution to displaying the currently logged in user and logout option
          * in the header see the following SO thread.
          * http://stackoverflow.com/questions/43481790/how-to-add-watch-to-track-a-value-in-cookies-inside-angular-directive/43482950#43482950
          */

          $scope.getUserCookie = function() {
              var loggedInUser = $cookies.get('loggedInUser');
              return loggedInUser;
          };
          console.log('loggedInUser in directive ', $rootScope.loggedInUser);

          $scope.logout = function() {
            console.log('Logout in directive');
            AuthService.logout().then(
              function() {
                $cookies.remove('loggedInUser');
                $rootScope.loggedInUser = '';
                $location.path('/admin/login');
                flashMessageService.setMessage("Successfully logged out");

              }, function(err) {
                  console.log('there was an error tying to logout', err);
              });
          };
        },
        templateUrl: 'partials/directives/admin-login.html'
      };
    }
  ])

  .directive('navBar', [
    function() {
      return {
        controller: function($scope, pagesFactory, $location) {
          var path = $location.path().substr(0, 6);
          if (path == "/admin") {
            $scope.navLinks = [{
              title: 'Pages',
              url: 'admin/pages'
            }, {
              title: 'Site Settings',
              url: 'admin/site-settings'
            }, ];
          } else {
            console.log('Not in Admin...');
            pagesFactory.getPages().then(
              function(response) {
                console.log('res ', response);
                $scope.navLinks = response.data;
              }, function() {

              });
            }
          },
          templateUrl: 'partials/directives/nav.html'

        };
    }
  ]);
