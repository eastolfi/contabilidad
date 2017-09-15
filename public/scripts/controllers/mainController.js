/* global application, _ */

application.controller('mainController', ['$scope', function ($scope) {
    $scope.dataTableSource = 'public/templates/movements-table.tmpl.html';
    $scope.activeTable = 'moves';
    
    $scope.changeDataTable = function(type) {
    	if (type === 'moves') {
    		$scope.dataTableSource = 'public/templates/movements-table.tmpl.html';
    	} else if (type === 'predefined') {
    		$scope.dataTableSource = 'public/templates/predefined-table.tmpl.html';
    	}
    	
    	$scope.activeTable = type;
    };
}]);