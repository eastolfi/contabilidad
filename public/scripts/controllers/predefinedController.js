/* global angular, application, _ */

application.controller('predefinedController', ['$scope', '$mdToast', '$mdDialog', '$predefined', function ($scope, $mdToast, $mdDialog, $predefined) {
    var parent = $scope.$parent.$parent;
    
    parent.reloadData = function () {
		return $predefined.movements.get($scope.query, parent.onLoadDataSuccess).$promise;
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
				var movimiento = new $predefined.movements(result.data);
				
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
			templateUrl: 'public/templates/add-item-pred-dialog.tmpl.html',
			parent: angular.element(document.body),
			clickOutsideToClose: false,
			locals: {local: [_item, $scope, _scope || null, false]}
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
			$predefined.movements.remove({moves: selected}, function(a, b, c) {
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
	
	parent.getData();
}]);