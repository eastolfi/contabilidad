'use strict';

angular.module('contabilidadApp').factory('$movement', ['$resource', function ($resource) {
	return {
		movements: $resource('/movement/:id', {id: '@_id'}, {
			update: {
				method: 'PUT'
			}
		})
	};
}]);