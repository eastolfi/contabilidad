/* global application, _ */

application.controller('showItemCtrl', 
    ['$scope', '$filter', '$mdDialog', '$mdDatePicker', '$predefined', 'local', 
    function ($scope, $filter, $mdDialog, $mdDatePicker, $predefined, local) {
        var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        var move_types = ['Casa / Fijos', 'Compras', 'Bares / Restaurantes', 'Comida Trabajo', 'Otros'];
        
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
    	
    	var loadPredefinedList = local[3];
    	
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
    	
    	$scope.predefinedMoves = [];
    	if (loadPredefinedList) {
    	    $predefined.selector.get(function(data) {
    	        $scope.predefinedMoves = data.data;
    	    });
    	    
        // 	$scope.predefinedMoves = [{
        // 		concept: "Alquiler ${MES}",
        // 		amount: 950,
        // 		day: "02",
        // 		type: "Casa / Fijos"
        // 	}, {
        // 		concept: "Luz ${MES}",
        // 		amount: 45,
        // 		day: "22",
        // 		type: "Casa / Fijos"
        // 	}, {
        // 		concept: "Navigo ${MES}",
        // 		amount: 105,
        // 		day: "01",
        // 		type: "Casa / Fijos"
        // 	}, {
        // 		concept: "Leader Price",
        // 		type: "Compras"
        // 	}];
    	}
    	
    	var _newMove = null;
    	var restoreMovement = function() {
    		if (!_.isNil(_newMove)) {
    			$scope.move.concept = _newMove.concept;
    			$scope.move.amount = _newMove.amount;
    			$scope.move.date = _newMove.date;
    			$scope.localDate = $filter('date')(_newMove.date, 'dd/MM/yyyy');
    			$scope.move.type = _newMove.type;
    			
    			_newMove = null;
    		}
    	};
    	
    	var loadPredefined = function() {
    		var date = new Date();
    		
    		if (_.isNil(_newMove)) {
    			_newMove = _.cloneDeep($scope.move);
    		}
    		
    		var _concept = $scope.predefinedMoves[$scope.predefined].concept;
    		var _amount = $scope.predefinedMoves[$scope.predefined].amount;
    		var _day = $scope.predefinedMoves[$scope.predefined].day;
    		var _type = $scope.predefinedMoves[$scope.predefined].type;
    		
    		if (_concept != null && _concept !== '') {
    			_concept = _concept.replace(/\${MES}/, months[date.getMonth()]);
    			
    			$scope.move.concept = _concept;
    		} else {
    			$scope.move.concept = '';
    		}
    		
    		if (_amount != null && _amount !== '' && _amount > 0) {
    			$scope.move.amount = _amount;
    		} else {
    			$scope.move.amount = '';
    		}
    		
    		if (_day != null && _day !== '' && _day >= 1 && _day <= 31) {
    			date.setDate(_day);
    		
    			$scope.localDate = $filter('date')(date, 'dd/MM/yyyy');
    			$scope.move.date = date;
    		} else {
    			$scope.localDate = $filter('date')(new Date(), 'dd/MM/yyyy');
    			$scope.move.date = new Date();
    		}
    		
    		if (_type != null && _type !== '') {
    			$scope.move.type = _type;
    		} else {
    			$scope.move.type = 'Otros';
    		}
    	};
    	
    	$scope.$watch('move.date', function(newVal, oldVal) {
    		if (newVal) {
    			$scope.localDate = $filter('date')(newVal, 'dd/MM/yyyy');
    		}
    	});
    	
    	$scope.$watch('predefined', function(newVal, oldVal) {
    		if (newVal) {
    			if (_.toNumber(newVal) === -1) {
    				restoreMovement();
    			} else {
    				loadPredefined();
    			}
    		}
    	});
}]);