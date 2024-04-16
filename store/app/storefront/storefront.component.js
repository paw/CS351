angular.
  module('storeApp').
  component('storefront', {
    // Note: The URL is relative to our `index.html` file
    templateUrl: 'storefront/storefront.template.html',
    controller: function StorefrontController() {
      pageLoad();
    }
  });