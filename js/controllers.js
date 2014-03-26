'use strict';

/* Utils */

var non_complianceComparator = function(nc1, nc2) {
	return (nc1.id < nc2.id) ? -1 : (nc2.id < nc1.id) ? 1 : 0;
}

// Obtient l'URL de l'image en fonction du statut (notifiée, corrigée ou validée)
var getImgSrc = function(nc) {
	switch (nc.status) {
		// Les status sont précédés de "a", "b" et "c" dans le fichier JSON afin de pouvoir faire
		// un tri par ordre alphabétique cohérent. On utilise des lettres et non des chiffres car les
		// noms des status sont utilisés comme classes CSS qui ne peuvent commencer par un chiffre.
		case "a_noticed_status":
			return "img/u163_normal.JPG";
		case "b_corrected_status":
			return "img/u169_normal.JPG";
		case "c_validated_status":
			return "img/u175_normal.JPG";
		default:
			return "";
	}
}

/* Controllers */

var ncControllers = angular.module('ncControllers', []);

// Contrôleur pour nc-list.html
ncControllers.controller('NcListController', function($scope, $http ) {
	if(typeof sessionStorage!='undefined') {
		// Les données sont récupérées dans le cache de la session courante...
		if ('non_compliances' in sessionStorage) {
			$scope.non_compliances = JSON.parse(sessionStorage['non_compliances']);
		} else {
		// ... ou chargées depuis un fichier JSON lorsqu'il s'agit de l'ouverture de la session
			$http.get('data/nc.json').success(function(data) {
				$scope.non_compliances = data;

				for (var i in $scope.non_compliances) {
					$scope.non_compliances[i].img = getImgSrc($scope.non_compliances[i]);
				}

				sessionStorage['non_compliances'] = JSON.stringify($scope.non_compliances);
			});
		}
	} else {
  		alert("sessionStorage n'est pas supporté");
	}

	$scope.orderOp = "id";

	$scope.setFilter = function(query) {
		$scope.query = query;
		document.getElementById("show_all_nc_button").disabled = query == "";
	}

	$scope.setOrder = function(order) {
		$scope.orderOp = order;
	}
});


ncControllers.controller('NcEditCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.ncId = $routeParams.ncId;

	if(typeof sessionStorage!='undefined') {
		if('non_compliances' in sessionStorage) {
			$scope.non_compliances = JSON.parse(sessionStorage['non_compliances']);
			var ncSessionStorageId;

			for (var i in $scope.non_compliances) {
				if($scope.ncId == $scope.non_compliances[i].id ) {
					ncSessionStorageId = i;
					$scope.nc = $scope.non_compliances[i];
					break;
				}
			}
		}
	} else {
		alert("sessionStorage n'est pas supporté");
	}
	
	// Les données sont sauvegardées pour le moment uniquement dans le cache et non dans le fichier JSON
	$scope.saveData = function( ) {
		$scope.non_compliances[ncSessionStorageId].lot = document.getElementById("nc_lot").value;
		$scope.non_compliances[ncSessionStorageId].enterprise = document.getElementById("nc_enterprise").value;
		$scope.non_compliances[ncSessionStorageId].location = document.getElementById("nc_location").value;
		
		if(typeof sessionStorage!='undefined') {
			if('non_compliances' in sessionStorage) {
				sessionStorage['non_compliances'] = JSON.stringify($scope.non_compliances);
			}
		}
	}
}]);