angular.
  module('storeApp').
  component('navigation', {
    // Note: The URL is relative to our `index.html` file
    templateUrl: 'navigation/navigation.template.html',
    controller: function NavigationListController() {
      navLoad();
        var linkys = document.querySelectorAll(".nav-link");
        linkys.forEach(link => {
          link.addEventListener('click', function() { currentPage(this)});
        });
    }
  });

  function currentPage(clicked) {
    var linkys = document.querySelectorAll(".nav-link");
    console.log("clicked: " + clicked.getAttribute("href"));
        linkys.forEach(link => {
            console.log("link:" + link.getAttribute("href")); //aria-current="page"
            link.removeAttribute("aria-current");
            link.classList.remove("active");
            if (link.getAttribute("href") == clicked.getAttribute("href")) {
              clicked.classList.add("active");
              clicked.setAttribute("aria-current","page");
            }
        });
  };

  function navLoad() {
    var linkys = document.querySelectorAll(".nav-link");
        linkys.forEach(link => {
            link.removeAttribute("aria-current");
            link.classList.remove("active");
            if ("." + window.location.href.substring(40) == link.getAttribute("href")) {
              link.classList.add("active");
              link.setAttribute("aria-current","page");
            }
        });
  };