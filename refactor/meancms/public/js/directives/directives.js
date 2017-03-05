angular.module('myApp.directives', [])
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
            console.log(' bot in admin...');
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
