'use strict';

angular.module('myApp.controllers', [])
  .controller('AppCtrl', ['$scope','AuthService','flashMessageService','$location',
    function($scope,AuthService,flashMessageService,$location) {
      $scope.site = {
          logo: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSEMHFEmvJzZEKf50D_xfT3Eeh0oDC2uQgUErUUWPA-7bKnpNaurg',
          footer: "Copyright 2017 MEAN CMS"
      };

      $scope.logout = function() {
        AuthService.logout().then(
          function() {
            $location.path('/admin/login');
            flashMessageService.setMessage("Successfully logged out");

          }, function(err) {
              console.log('there was an error tying to logout');
          });
      };
    }
  ])

  .controller('AdminPagesCtrl', ['$scope', '$log', 'pagesFactory',
    function($scope, $log, pagesFactory) {
      console.log('sjajhds');
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
  .controller('AdminLoginCtrl', ['$scope', '$location', '$cookies', 'AuthService', 'flashMessageService', '$log',
        function($scope, $location, $cookies, AuthService, flashMessageService, $log) {
          $scope.credentials = {
            username: '',
            password: ''
          };
          $scope.login = function(credentials) {
            AuthService.login(credentials).then(
              function(res, err) {
                $cookies.loggedInUser = res.data;
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
