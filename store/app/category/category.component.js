// Register `phoneList` component, along with its associated controller and template
angular.
  module('storeApp').
  component('category', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
    templateUrl: 'category/category.template.html',
    controller: async function categoryListController() {
      json = await getJSON();
      var doc = document.querySelector("#radios #radio-cat");
      doc.innerHTML = '';
      this.categories = json.categories;
      console.log("attempted fetch:\n" + this.categories);
      console.log(JSON.stringify(this.categories));
      this.categories.forEach((category) => {
        doc.innerHTML += 
        '<div class="form-check">'+
            '<input class="form-check-input" type="radio" name="category" id="' + category + '" value="' + category + '"/>' +
            '<label class="form-check-label" for="' + category + '">' + category + '</label></div>';
      });
      document.querySelector("input[name=\"category\"]").checked = 'true';
      document.querySelector("#radios #pick-category").addEventListener("click", function() { displayProducts(document.querySelector("#order-form tbody"),json) });
    }
  });