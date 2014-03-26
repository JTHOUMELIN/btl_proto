'use strict';

/* Routing */

var ncApp = angular.module('ncApp', ['ngRoute', 'ncControllers']);

ncApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.
	when('/non_compliances', { //Liste de non-conformités
		templateUrl: 'partials/nc-list.html',
		controller: 'NcListController'
	}).
	when('/non_compliance/:ncId', {
		templateUrl: 'partials/nc-edit.html',
		controller: 'NcEditCtrl'
	}).
	otherwise({
		redirectTo: '/non_compliances'
	});
}]);