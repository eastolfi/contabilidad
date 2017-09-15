/* global application, _ */

application.controller('exportDataCtrl',
	['$scope', '$mdDialog',
	function ($scope, $mdDialog) {
		var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    	var minYear = 2015, maxYear = 2017;
    	var move_types = ['Casa / Fijos', 'Compras', 'Bares / Restaurantes', 'Otros'];
    	
		$scope.move_types = move_types;
		$scope.months = months;
		$scope.years = [];
		for (var i = minYear; i <= maxYear; i++) { $scope.years.push(i); }
		
		$scope.export = {
			registros: 5
		};
		
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.view = function() {
			if ($scope.export.month === 'all') {
				$scope.export.month = "0-11";
			}
			if ($scope.export.year === 'all') {
				$scope.export.year = minYear + "-" + maxYear; 
			}
			$mdDialog.hide({done: true, data: $scope.export});
		};
		$scope.download = function() {
			alert('Init download');
		};
}]);