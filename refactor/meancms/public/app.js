'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.services',
  'myApp.controllers',
  'ngCookies',
  'message.flash',
  'myApp.filters'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');

  // $routeProvider.otherwise({redirectTo: '/view1'});

  $routeProvider.when('/admin/login', {
      templateUrl: 'partials/admin/login.html',
      controller: 'AdminLoginCtrl'
  });
  $routeProvider.when('/admin/pages', {
      templateUrl: 'partials/admin/pages.html',
      controller: 'AdminPagesCtrl'
  });
  // TODO
  $routeProvider.when('/admin/add-edit-page/:id', {
      templateUrl: 'partials/admin/add-edit-page.html',
      controller: 'AddEditPageCtrl'
  });
  $routeProvider.otherwise({
      redirectTo: '/'
  });
}]);
