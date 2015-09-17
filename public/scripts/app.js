'use strict';

angular.module('contabilidadApp', ['md.data.table', 'ngMaterial', 'ngMessages', 'ngResource', 'mdPickers'])

  .config(['$mdThemingProvider', function ($mdThemingProvider) {    
    
	// Take a look
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('pink');
  }]);