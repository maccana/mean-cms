'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngCookies',
  'ui.tinymce',
  'message.flash',
  'myApp.filters'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/admin/login', {
      templateUrl: 'partials/admin/login.html',
      controller: 'AdminLoginCtrl'
  });
  $routeProvider.when('/admin', {
      templateUrl: 'partials/admin/pages.html',
      controller: 'AdminPagesCtrl'
  });
  $routeProvider.when('/admin/pages', {
      templateUrl: 'partials/admin/pages.html',
      controller: 'AdminPagesCtrl'
  });
  $routeProvider.when('/admin/add-edit-page/:id', {
      templateUrl: 'partials/admin/add-edit-page.html',
      controller: 'AddEditPageCtrl'
  });
  $routeProvider.when('/:url', {
    templateUrl: 'partials/page.html',
    controller: 'PageCtrl'
  });
  $routeProvider.otherwise({
      redirectTo: '/'
  });
}]);
