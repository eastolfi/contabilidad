/* global angular, application, _ */

application.controller('movementController', ['$scope', '$mdToast', '$mdDialog', '$movement', function ($scope, $mdToast, $mdDialog, $movement) {
    var parent = $scope.$parent.$parent;
    
    parent.reloadData = function () {
		return $movement.movements.get($scope.query, parent.onLoadDataSuccess).$promise;
	};
	
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
					$scope.getData();
					
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
			controller: 'showItemCtrl',
			templateUrl: 'public/templates/add-item-dialog.tmpl.html',
			parent: angular.element(document.body),
			clickOutsideToClose: false,
			locals: {local: [_item, $scope, _scope || null, true]}
		})
		.then(_success);
	};
	
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
				$scope.getData();
				
				$mdToast.show(
					$mdToast.simple()
					.content('Se han borrado ' + l + ' movimientos')
					.position('top right')
					.hideDelay(3000)
				);
			});
			
		});
	};
	
	$scope.showExportDialog = function() {
    		var _success = function(result) {
    			if (result.done === true) {
    				var _export = result.data;
    				var win = window.open('pdfExport/' + _export.month + '/' + _export.year, '_blank');
    				if (win){
    				    //Browser has allowed it to be opened
    				    win.focus();
    				}else{
    				    //Broswer has blocked it
    				    alert('Please allow popups for this site');
    				}
    			}
    		};
    		
    		$mdDialog.show({
    			controller: 'exportDataCtrl',
    			templateUrl: 'public/templates/export-data-dialog.tmpl.html',
    			parent: angular.element(document.body),
    			clickOutsideToClose: false
    		})
    		.then(_success);
    	};
	
	parent.getData();
}]);