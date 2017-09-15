/* global application */

'use strict';

application.factory('$predefined', ['$resource', function ($resource) {
	return {
		movements: $resource('/predefined/:id', {id: '@_id'}, {
			update: {
				method: 'PUT',
                isArray: true
			},
            remove: {
                method: 'DELETE',
                isArray: true
            }
		}),
		
		selector: $resource('/predefined/comboList')
	};
}]);