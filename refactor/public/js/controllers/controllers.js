'use strict';

angular.module('myApp.controllers', [])
  .controller('AppCtrl', ['$scope', '$rootScope', '$cookies','AuthService','flashMessageService','$location',
    function($scope, $rootScope, $cookies, AuthService,flashMessageService,$location) {
      console.log('In AppCtrl');
      $scope.$loggedInUser = $cookies.get("loggedInUser");
      console.log("LogInUsr in AppCtrl ", $rootScope.loggedInUser );
      $scope.site = {
          logo: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSEMHFEmvJzZEKf50D_xfT3Eeh0oDC2uQgUErUUWPA-7bKnpNaurg',
          footer: "Copyright 2017 MEAN CMS"
      };
      // console.log("Cookies: ", $cookies);
    }
  ])
  
  .controller('AdminPagesCtrl', ['$scope', '$log', 'pagesFactory',
    function($scope, $log, pagesFactory) {
      pagesFactory.getPages().then(
        function(response) {
          console.log(response.data);
          $scope.allPages = response.data;
        },
        function(err) {
          $log.error(err);
        });

        $scope.deletePage = function(id, index) {
          console.log('id passed ', id);
          console.log('Deleting index: ', index);
          pagesFactory.deletePage(id).then(function(item) {
            console.log('DELETED: ', item );
            $scope.allPages.splice(index, 1);
          });
        };

      }
  ])

  .controller('AddEditPageCtrl', ['$scope', '$log', 'pagesFactory', '$routeParams', '$location', 'flashMessageService', '$filter',
    function($scope, $log, pagesFactory, $routeParams, $location, flashMessageService, $filter) {

          $scope.updateURL = function() {
            $scope.pageContent.url = $filter('formatURL')($scope.pageContent.title);
          }

          $scope.pageContent = {};
          $scope.pageContent._id = $routeParams.id;
          $scope.heading = "Add a New Page";

          if ($scope.pageContent._id !== 0) {
            $scope.heading = "Update Page";
            pagesFactory.getAdminPageContent($scope.pageContent._id).then(
                function(response) {
                  $scope.pageContent = response.data;
                  $log.info($scope.pageContent);
                },
                function(err) {
                  $log.error(err);
                });
          }

          $scope.savePage = function() {
            pagesFactory.savePage($scope.pageContent).then(
              function() {
                flashMessageService.setMessage("Page Saved Successfully");
                $location.path('/admin/pages');
              },
              function() {
                $log.error('error saving data');
              }
            );
          };
      }
  ])
  .controller('AdminLoginCtrl', ['$scope', '$rootScope', '$location', '$cookies', 'AuthService', 'flashMessageService', '$log',
        function($scope, $rootScope, $location, $cookies, AuthService, flashMessageService, $log) {
          // $scope.adminLoggedIn = false;
          $scope.credentials = {
            username: '',
            password: ''
          };

          $scope.login = function(credentials) {
            console.log('Login func in AdminLoginCtrl');
            AuthService.login(credentials).then(
              function(res) {
                $cookies.put('loggedInUser', res.data);
                $rootScope.loggedInUser = $cookies.loggedInUser;
                console.log('Logged in User: ', $cookies.get("loggedInUser"));
                //$rootScope.adminLoggedIn = true; // Should be set in user account in DB
                $location.path('/admin/pages');
              },
              function(err) {
                flashMessageService.setMessage(err.data);
                $log.log(err);
              });
            };
        }
    ])
    .controller('PageCtrl', ['$scope','pagesFactory', '$routeParams', '$sce', function($scope, pagesFactory, $routeParams,$sce) {
        var url = $routeParams.url;
        console.log('rPARAMS..', url);

        if(url == '/admin') {
          console.log('bloody admin..');
          pagesFactory.getPages().then(
            function(response) {
              console.log(response.data);
              $scope.allPages = response.data;
            },
            function(err) {
              $log.error(err);
            });
        }
          if(!url) url = 'home';
          pagesFactory.getPageContent(url).then(

          function(response) {
            $scope.pageContent = {};
            $scope.pageContent.title = response.data.title;
            $scope.pageContent.content = $sce.trustAsHtml(response.data.content);

          }, function() {
              console.log('error fetching data');
      });
    }])
