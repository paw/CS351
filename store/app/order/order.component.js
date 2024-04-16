angular.
  module('storeApp').
  component('order', {
    // Note: The URL is relative to our `index.html` file
    templateUrl: 'order/order.template.html',
    controller: function ProductsListController() {
        document.getElementById("order-confirm").addEventListener("click", function() { finalizeOrder(document.querySelector("#order-confirm tbody"),json) });
        document.getElementById("reset").addEventListener("click", function() { reset(json) });
    }
  });