/* global angular */
'use strict';

angular.module('contabilidadApp').controller('appTableController',
	['$mdDialog', '$mdToast', '$mdDatePicker', '$movement', '$scope', '$q', '$timeout', '$filter', '$http',
	function ($mdDialog, $mdToast, $mdDatePicker, $movement, $scope, $q, $timeout, $filter, $http) {
	
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
  
	$scope.columns = [{
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
    }
    
    function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		
		return function filterFn(_type) {
			return ((angular.lowercase(_type).indexOf(lowercaseQuery) !== -1) &&
					($scope.query.filter.types.indexOf(_type) === -1));
		};
    }
	
	/*******/
	//TODO <-------------
	var _amounts = [];
	
	$scope.calculateTotal = function(index) {
		var _t = 0;
		
		for (var i = index; i < _amounts.length; i++) {
			_t += +_amounts[i];
		}
		
		return _t;
	};
		
	$scope.onChange = function () {
		return $movement.movements.get($scope.query, success).$promise;
	};
	
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
	
	function success(desserts) {
		$scope.desserts = desserts;
		
		if (desserts.count <= ($scope.query.limit * ($scope.query.page - 1))) {
			$scope.query.page -= 1;
		}
		
		_amounts = [];
        if ($scope.query.page > 0) {
            var _data = $scope.filterOrderBy(desserts.data, $scope.query.order);
            var _init = $scope.query.limit * ($scope.query.page - 1);
            for (var i = _init; i < _data.length; i++) {
                _amounts.push(_data[i].amount);
            }
        }
	}
	
	$scope.showItemDialog = function(_item, _scope) {
		$scope.currentDialog = $scope.showItemDialog;
		
		var _method = null;
		var _msg = '';
		if (!_item) {
			_method = '$save';
			_msg = 'Movimiento creado.';
		} else {
			_method = '$update';
			_msg = 'Movimiento actualizado.';
		}
		
		var _success = function(result) {
			if (result.done === true) {
				var movimiento = new $movement.movements(result.data);
				
				movimiento[_method](function(response) {
					getDesserts();
					
					$mdToast.show(
						$mdToast.simple()
						.content(_msg)
						.position('top right')
						.hideDelay(3000)
					);
				});
			}
		};
		
		$mdDialog.show({
			controller: ShowItemController,
			templateUrl: 'public/templates/add-item-dialog.tmpl.html',
			parent: angular.element(document.body),
			clickOutsideToClose: false,
			locals: {local: [_item, $scope, _scope || null]}
		})
		.then(_success);
	};
	
	function ShowItemController($scope, $filter, $mdDialog, $mdDatePicker, local) {
		if (local[2]) {
			$scope.move = local[2].move;
		} else {
			if (local[0]) {
				$scope.move = local[0];
				$scope.title = 'Modificar Gasto';
			} else {
				$scope.move = {
					date: new Date(),
					type: 'Otros'
				};
				$scope.title = 'Añadir Gasto';
			}
		}
		$scope.dialog = local[1].currentDialog;
		
		$scope.showPicker = function(ev) {//sc-date-time
			$mdDatePicker(ev, $scope.move.date).then(function(selectedDate) {
				$scope.move.date = selectedDate;//.toISOString();
				$scope.dialog(local[0], $scope);
			});
		};
		
		$scope.myDate = new Date();
		
		$scope.maxDate = new Date(
			$scope.myDate.getFullYear(),
			$scope.myDate.getMonth() + 2,
			$scope.myDate.getDate()
		);
		
		$scope.move_type = move_types;
		
		$scope.hide = function() {
			$mdDialog.hide({create: false});
			// Reset model on Update
		};
		$scope.cancel = function() {
			// Confirm / Save State?
			$mdDialog.cancel();
			// Reset model on Update
		};
		$scope.create = function() {
			$mdDialog.hide({done: true, data: $scope.move});
		};
		
		$scope.$watch('move.date', function(newVal, oldVal) {
			if (newVal) {
				$scope.localDate = $filter('date')(newVal, 'dd/MM/yyyy');
			}
		});
	}
	
	$scope.showExportDialog = function() {
		var _success = function(result) {
			if (result.done === true) {
				var _export = result.data;
				$http({
					method: 'GET',
					url: '/getExport',
					params: _export
				}).then(function successCallback(response) {
					$scope.totalExport = response.data;
				}, function errorCallback(response) {
					console.log(response);
				});
			}
		};
		
		$mdDialog.show({
			controller: ExportDataController,
			templateUrl: 'public/templates/export-data-dialog.tmpl.html',
			parent: angular.element(document.body),
			clickOutsideToClose: false
		})
		.then(_success);
	};
	
	function ExportDataController($scope, $mdDialog) {
		$scope.move_types = move_types;
		$scope.export = {
			registros: 5
		};
		
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.view = function() {
			$mdDialog.hide({done: true, data: $scope.export});
		};
		$scope.download = function() {
			alert('Init download');
		};
	}
	
	$scope.delete = function (_seleted) {
		var selected = _seleted;
		var l = selected.length;
		
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm()
			.title('Borrar movimientos')
			.content('Estás a punto de borrar ' + l + ' movimientos. ¿Quieres continuar?')
			.ariaLabel('Delete items')
			.ok('Confirmar')
			.cancel('Cancelar');
		
		$mdDialog.show(confirm).then(function() {
			$movement.movements.remove({moves: selected}, function(a, b, c) {
				getDesserts();
				
				$mdToast.show(
					$mdToast.simple()
					.content('Se han borrado ' + l + ' movimientos')
					.position('top right')
					.hideDelay(3000)
				);
			});
			
		});
	};
  
	function getDesserts() {
		$scope.deferred = $scope.onChange();
	}
	
	
	$scope.loadStuff = function () {
		var deferred = $q.defer();

		$timeout(function () {
			deferred.reject();
		}, 2000);

		$scope.deferred = deferred.promise;
	};
	
	$scope.showPicker = function(ev) {//sc-date-time
		$mdDatePicker(ev, $scope.query.filter.date).then(function(selectedDate) {
			$scope.query.filter.date = selectedDate;//.toISOString();
		});
	};
	
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

		getDesserts();
	}, true);
  
}]);