'use strict';

angular.module('contabilidadApp').controller('appTableController', ['$mdDialog', '$mdToast', '$mdDatePicker', '$movement', '$scope', '$q', '$timeout', 
	function ($mdDialog, $mdToast, $mdDatePicker, $movement, $scope, $q, $timeout) {
	
	var bookmark;
  
	$scope.selected = [];
	  
	$scope.filter = {
		options: {
			debounce: 500
		}
	};

	$scope.query = {
		order: 'name',
		limit: 5,
		page: 1
	};
  
	$scope.columns = [{
		name: 'Fecha',
		orderBy: 'date',
		descendFirst: true
	}, {
		name: 'Concepto',
		orderBy: 'concept'
	}, {
		name: 'Cantidad',
		numeric: true,
		orderBy: 'amount'
	}, {
		name: 'Total',
		numeric: true,
		orderBy: 'total'
	}, {
		name: 'Acciones'
	}];
		
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
		$scope.query.filter = '';

		if($scope.filter.form.$dirty) {
			$scope.filter.form.$setPristine();
		}
	};
	
	function success(desserts) {
		$scope.desserts = desserts;
		
		_amounts = [];
		for (var i = 0; i < desserts.data.length; i++) {
			_amounts.push(desserts.data[i].amount);
		}
	}
	
	$scope.showAdvanced = function(ev, _scope) {
		//$scope.createDialog = $mdDialog;
		$scope.createDialog = $scope.showAdvanced;
		
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'public/templates/add-item-dialog.tmpl.html',
			parent: angular.element(document.body),//querySelector('md-card#mainCard')
			targetEvent: ev,
			clickOutsideToClose:false,
			locals: {local: [$scope.createDialog, $scope, _scope || null]}
		})
		.then(function(result) {
			if (result.create === true) {
				var movimiento = new $movement.movements(result.data);
				
				movimiento.$save(function(response) {
					getDesserts();
					
					$mdToast.show(
						$mdToast.simple()
						.content('Movimiento creado.')
						.position('top right')
						.hideDelay(3000)
					);
				});
			}
		});
	};
	function DialogController($scope, $mdDialog, $mdDatePicker, local) {
		if (local[2]) {
			$scope.newMov = local[2].newMov;
		} else {
			$scope.newMov = {
				date: new Date()
			};
		}
		$scope.dialog = local[1].createDialog;
		
		$scope.showPicker = function(ev) {//sc-date-time
			$mdDatePicker(ev, $scope.newMov.date).then(function(selectedDate) {
				$scope.newMov.date = selectedDate;
				$scope.dialog(null, $scope);
			});
		};
		
		$scope.myDate = new Date();
		
		$scope.maxDate = new Date(
			$scope.myDate.getFullYear(),
			$scope.myDate.getMonth() + 2,
			$scope.myDate.getDate()
		);
		
		$scope.hide = function() {
			$mdDialog.hide({create: false});
		};
		$scope.cancel = function() {
			// Confirm / Save State?
			$mdDialog.cancel();
		};
		$scope.create = function() {
			$mdDialog.hide({create: true, data: $scope.newMov});
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
	});
  
}]);