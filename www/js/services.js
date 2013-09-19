/*
 * BartRT - services.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */

BartRT.factory('helloWorldFromFactory', ['$http', function($http) {
    return {

    	// NOTES: we pass the $http service through here as a dependency to the helloWorldFromFactory
    	// service, and can then use it in the getPage call

    	getPage: function() {
    		$http.get('/test/bart/EMBR.xml').success(function(data) {
    			debugger;
    			return data;
    		});
    	},

        sayHello: function() {
            return "Hello, World!"
        }
    };
}]);