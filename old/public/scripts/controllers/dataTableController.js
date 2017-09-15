/* global angular, application, _ */

application.controller('dataTableController',
	['$mdDialog', '$mdToast', '$mdDatePicker', '$movement', '$scope', '$q', '$timeout', '$filter', '$http',
	function ($mdDialog, $mdToast, $mdDatePicker, $movement, $scope, $q, $timeout, $filter, $http) {
	    var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    	$scope.months = months;
    // 	var minYear = 2015, maxYear = 2016;
    	
    	var bookmark;
      
    	$scope.selected = [];
    	  
    	$scope.filter = {
    		options: {
    			debounce: 500
    		}
    	};
    	
    	$scope.query = {
    		order: '-date',
    		limit: 5,
    		page: 1,
    		filter: {
    			date: '',
    			concept: '',
    			amount: '',
    			types: []
    		}
    	};
	
	    $scope.columns = [{ // Move to readSyncJson
    		name: 'Fecha',
    		orderBy: 'date'
    	}, {
    		name: 'Concepto',
    		orderBy: 'concept'
    	}, {
    		name: 'Cantidad',
    		numeric: true,
    		orderBy: 'amount'
    	}, {
    		name: 'Tipo',
    		orderBy: 'type'
    	}, {
    		name: 'Total',
    		numeric: true,
    		orderBy: 'total'
    	}, {
    		name: 'Acciones'
    	}];
    	
    	var move_types = ['Casa / Fijos', 'Compras', 'Bares / Restaurantes', 'Otros'];
    	// $scope.typesToQuery = [];
    	$scope.searchForType = null;
    	$scope.querySearch = function(query) {
    		var results = query ? move_types.filter(createFilterFor(query)) : [];
      		
      		return results;
        };
        
        function createFilterFor(query) {
    		var lowercaseQuery = angular.lowercase(query);
    		
    		return function filterFn(_type) {
    			return ((angular.lowercase(_type).indexOf(lowercaseQuery) !== -1) &&
    					($scope.query.filter.types.indexOf(_type) === -1));
    		};
        }
    	
    	var _amounts = [];
    	$scope.onLoadDataSuccess = function(data) {
    		$scope.tableData = data;
    		
    		if (data.count <= ($scope.query.limit * ($scope.query.page - 1))) {
    			$scope.query.page -= 1;
    		}
    		
    		_amounts = [];
            if ($scope.query.page > 0) {
                var _data = $scope.filterOrderBy(data.data, $scope.query.order);
                var _init = $scope.query.limit * ($scope.query.page - 1);
                for (var i = _init; i < _data.length; i++) {
                    _amounts.push(_data[i].amount);
                }
            }
    	};
    	
    	$scope.reloadData = false;
    	
    	$scope.getData = function() {
    	    if ($scope.reloadData) {
        		$scope.deferred = $scope.reloadData();
    	    }
    	};
    	
    	$scope.calculateTotal = function(index) {
    		var _t = 0;
    		
    		for (var i = index; i < _amounts.length; i++) {
    			_t += _.toNumber(_amounts[i]);
    		}
    		
    		return _t;
    	};
    	
    	$scope.showPicker = function(ev) {//sc-date-time
    		$mdDatePicker(ev, $scope.query.filter.date).then(function(selectedDate) {
    			$scope.query.filter.date = selectedDate;//.toISOString();
    		});
    	};
    	
    	/****************************
    	 *          FILTER          *
    	 ****************************/
    	 
	    $scope.searchForType = null;
    	$scope.querySearch = function(query) {
    		var results = query ? move_types.filter(createFilterFor(query)) : [];
      		
      		return results;
        };
        
        function createFilterFor(query) {
    		var lowercaseQuery = angular.lowercase(query);
    		
    		return function filterFn(_type) {
    			return ((angular.lowercase(_type).indexOf(lowercaseQuery) !== -1) &&
    					($scope.query.filter.types.indexOf(_type) === -1));
    		};
        }
	    
	    $scope.removeFilter = function () {
        	$scope.filter.show = false;
        	$scope.query.filter.date = '';
        	$scope.query.filter.concept = '';
        	$scope.query.filter.amount = '';
        	$scope.query.filter.types = [];
        
        	if($scope.filter.form.$dirty) {
        		$scope.filter.form.$setPristine();
        	}
        };
        
        $scope.filterOrderBy = $filter('orderBy');
    	$scope.$watch('query.filter.date', function(newVal, oldVal) {
    		if (newVal) {
    			$scope.filterDate = $filter('date')(newVal, 'dd/MM/yyyy');
    		}
    	});
    	
    	$scope.$watch('query.filter', function (newValue, oldValue) {
    		if(!oldValue) {
    			bookmark = $scope.query.page;
    		}
    
    		if(newValue !== oldValue) {
    			$scope.query.page = 1;
    		}
    
    		if(!newValue) {
    			$scope.query.page = bookmark;
    		}
    
    		$scope.getData();
    	}, true);
    	
}]);