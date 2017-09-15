/* global angular */

'use strict';

var application = angular.module('contabilidadApp', ['md.data.table', 'ngMaterial', 'ngMessages', 'ngResource', 'mdPickers']);

application.config(['$mdThemingProvider', function ($mdThemingProvider) {
    
	// Take a look
  $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('pink');
}]);