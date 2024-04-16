angular.
  module('storeApp').
  component('products', {
    // Note: The URL is relative to our `index.html` file
    templateUrl: 'products/products.template.html',
    controller: function ProductsListController() {
      document.getElementById("order-proceed").addEventListener("click", function() { generateInvoice(json); });
      document.getElementById("restart").addEventListener("click", function() { softReset(json) });
    }
  });