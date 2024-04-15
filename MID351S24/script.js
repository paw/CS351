let json;

let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

//simple function to clear the product table's contents
function clearTable(table) {
    table.innerHTML = '';
}

//fuction to compare 2 strings
function compareString(a, b) {
    // localeCompare docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
    if (a.localeCompare(b, 'en', { sensitivity: 'base' }) <= -1){
        // a comes before b
        return -1;
    } else if (a.localeCompare(b, 'en', { sensitivity: 'base' }) >= 1){
        // a comes after b
        return 1;
    } else {
        // they're the same
        return 0;
    }
}
//Function to compare by cost
function compareByCost(a, b) {
    if (parseFloat(a) < parseFloat(b)) {
        return -1;
    } else if (parseFloat(a) > parseFloat(b)) {
        return 1;
    } else {
        return 0;
    }
}

function displayTopics(container, json) {
    for (var i = 0; i < json.topics.length; i++) {
        var checkbox = document.createElement("div");
        checkbox.innerHTML = "<div class=\"form-check\">" +
            "<input class=\"form-check-input\" type=\"checkbox\" name=\"topic\" id=\"topic-" + i + "\" value=\"" + json.topics[i] + "\">" +
            "<label class=\"form-check-label\" for=\"topic-" + i + "\">"+
                json.topics[i] + "</label></div>";
        container.appendChild(checkbox);
    }
}

function displayProducts(table, json) {

    clearTable(table);
    sortByAttribute(table, "[data-id]");

    var category = document.querySelector("input[name=\"category\"]:checked").value;
    document.querySelector("#category-picked").innerText = category;
    for (var i = 0; i < json.products.length; i++) {
        if(json.products[i].category.localeCompare(category, 'en', { sensitivity: 'base' }) == 0) {
            var tr = document.createElement('tr');
            tr.setAttribute("data-id",json.products[i].id );
            tr.setAttribute("data-name",json.products[i].name);
            tr.setAttribute("data-category",json.products[i].category);
            tr.setAttribute("data-cost",json.products[i].cost);
            tr.setAttribute("data-quantity",json.products[i].quantity);


            tr.innerHTML = "<td>" + json.products[i].id + "</td>";
            tr.innerHTML += "<td data-name=\"name\">" + json.products[i].name + "</td>";
            tr.innerHTML += "<td>" + json.products[i].category + "</td>";
            tr.innerHTML += "<td>" + USDollar.format(json.products[i].cost) + "</td>";
            tr.innerHTML += "<td><ul></ul></td>";
            if (!(json.products[i].organic === undefined) && json.products[i].organic == true) {
                tr.querySelector("td:last-child ul").innerHTML += "<li>Certified Organic</li>";
            }
            if (!(json.products[i].variety === undefined)) {
                tr.querySelector("td:last-child ul").innerHTML += "<li>Variety: " + json.products[i].variety + "</li>";
            }
            if (!(json.products[i].colors === undefined)) {
                tr.querySelector("td:last-child ul").innerHTML += "<li>Colors: " + json.products[i].colors + "</li>";
            }
            if(!(json.products[i].flavors === undefined)) {
                tr.querySelector("td:last-child ul").innerHTML += "<li>Flavors: " + json.products[i].flavors + "</li>";
            }
            if(!(json.products[i].animals === undefined)) {
                tr.querySelector("td:last-child ul").innerHTML += "<li>Made for: " + json.products[i].animals + "</li>";
            }
            tr.innerHTML += "<td>" + json.products[i].quantity + "</td>";
            tr.innerHTML += "<td><div class=\"form-group\"><input type=\"number\" min=\"0\" max=\"" + json.products[i].quantity + "\" value=\"0\"></div></td>" ;
            table.appendChild(tr);
        }
    }
    document.querySelector("#radios").classList.toggle("hide");
    document.querySelector("#order-form").classList.toggle("hide");
}

function generateInvoice(json) {
    var products = document.querySelectorAll("#form-products tr");
    var invoice = document.querySelector("#confirm-products tbody");
    clearTable(invoice);

    var numOrdered = 0;
    var subtotal = 0;

    for (var i = 0; i < products.length; i++) {
        console.log(products[i]);
        console.log(products[i].getAttribute("data-quantity"));
        if(products[i].querySelector("input") && products[i].querySelector("input").valueAsNumber > 0) {
            if(products[i].querySelector("input").valueAsNumber <= products[i].getAttribute("data-quantity")) {
                invoice.appendChild(products[i].cloneNode(true));
                var added = invoice.querySelector("tr:last-child td:last-child");
                added.innerHTML = "<b>" + products[i].querySelector("input").value + "</b>";
                invoice.querySelector("tr:last-child").setAttribute("data-num2order", products[i].querySelector("input").valueAsNumber);
                subtotal += products[i].querySelector("input").valueAsNumber * products[i].getAttribute("data-cost");
                numOrdered++;
            } else {
                alert("You selected more item(s) than we have available. Please double check your selections.");
                return;
            }
        }
    }
    if (numOrdered == 0) {
        alert("You did not order anything.");
    } else {
        document.querySelector("#order-invoice").classList.remove("hide");
        document.querySelector("#order-form").classList.add("hide");
        document.querySelector("#subtotal").innerText = USDollar.format(subtotal);
        document.querySelector("#subtotal").setAttribute("data-subtotal",subtotal);
    }
}

async function sendRequest(data, url, step) {
    let xhr = new XMLHttpRequest();

    if (step == 2) {
        let arr = "";
        for (var i = 0; i < data.length; i++) {
            arr += data[i].value + "\n"
        }
        data = arr;
    }
    console.log("data: ", data);

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(data);
    console.log("sent reqest to server");
    xhr.onreadystatechange = function (oEvent) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Success! ",xhr.responseText);
                handleResponse(xhr, step);
            } else {
            console.log("Error: ", xhr.statusText);
            }
        }
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleResponse(xhr, step) {
    if (step == 1) {
        document.querySelector("#connect").classList.add("hide");
        document.querySelector("#usertab").classList.remove("hide");
        document.querySelector("#topics").classList.remove("hide");
        document.querySelector("#username").innerText = document.querySelector("#getuser").value;
        document.querySelector("#connect-form").remove();
        console.log("json before:\n"+ json);
        json = await this.getJSON('./data/topics.json');
        console.log("json after:\n" + json);
        console.log("getting json again");
        var container = document.querySelector("#checkbox-topics");
        container.innerHTML = '';
        displayTopics(container,json);
    }
    //document.getElementById("thanks").classList.remove("hide");
    //sleep(2500).then(() => { window.location.href = "/~sullivb/hw/invoice.html?order=" + xhr.responseText; });
}

async function finalizeOrder() {
    var data = "{\n\"INFO\": {\n\"subtotal\": \"" + parseFloat(document.querySelector("#subtotal").getAttribute("data-subtotal")).toFixed(2) + "\"\n},\n\"ORDER\": [\n";
    var itemsToOrder = document.querySelectorAll("#confirm-products tbody tr");

    if (itemsToOrder.length > 0) {

        for (var i = 0; i < itemsToOrder.length; i++) {
            data += "{\n\"id\": \"" + itemsToOrder[i].getAttribute("data-id") + "\",\n\"category\": \"" + itemsToOrder[i].getAttribute("data-category") + "\",\n\"quantity\": \"" + itemsToOrder[i].getAttribute("data-num2order") + "\",\n\"name\": \"" + itemsToOrder[i].getAttribute("data-name") + "\",\n\"cost\": \"" + parseFloat(itemsToOrder[i].getAttribute("data-cost")).toFixed(2) + "\"\n}";
            if (i != itemsToOrder.length-1) {
                data += ",\n";
            }
        }
        data += "\n]\n}";
        console.log("final data: " + data);
        sendRequest(data);
        return true;
    } else {
        alert("Something went wrong.");
        return false;
    }
}

function sortByAttribute(table, attr) {
    // for most we can just compare the attribute values...
    [...table.children]
    .sort((a, b) => compareString(a.getAttribute(attr), b.getAttribute(attr)))
    .forEach(node => table.appendChild(node));
}
function sortByPrice(table) {
    // ...but in the case of cost it needs to be compared numerically
    [...table.children]
    .sort((a, b) => compareByCost(a.getAttribute("data-cost"), b.getAttribute("data-cost")))
    .forEach(node => table.appendChild(node));
}

async function getJSON(url) {
    // fetching our json file, must not cache or it won't update product info when called again
    return fetch(url, {cache: "no-cache"})
        .then((response)=>response.json())
        .then((responseJson)=>{return responseJson});
}

function softReset(json) {
    var container = document.querySelector("#checkbox-topics");
    container.innerHTML = '';
    displayTopics(container,json);
    document.querySelector("#topics").classList.remove("hide");
    document.querySelector("#new").classList.add("hide");
    document.querySelector("#order-form").classList.add("hide");
    document.querySelectorAll("button").forEach((element) => element.disabled = false );
}

function connect() {
    let user = document.querySelector("#getuser");
    if (user.value.length > 0) {
        sendRequest(user.value, './cgi-bin/connect.cgi', 1);
    } else {
        alert("Please enter a name.");
    }
}

function fetchPosts() {
    let selected = document.querySelectorAll("input[name=\"topic\"]:checked");
    if (selected.length > 0) {
        sendRequest(selected, './cgi-bin/fetch.cgi', 2);
    } else {
        alert("Please select at least one topic");
    }
}

async function reset() {
    console.log("json before:\n"+ json);
    json = await this.getJSON('./data/topics.json');
    console.log("json after:\n" + json);
    console.log("getting json again");
    var container = document.querySelector("#checkbox-topics");
    container.innerHTML = '';
    displayTopics(container,json);
    softReset(json);
}

async function pageLoad() {
    // We don't want to do anything until we get the JSON.
    document.querySelectorAll("button").forEach((element) => element.disabled = false );
    document.getElementById("connect").addEventListener("click", function() { connect() });
    document.getElementById("pick-topics").addEventListener("click", function() { fetchPosts() });
    /*document.getElementById("order-confirm").addEventListener("click", function() { finalizeOrder(document.querySelector("#order-confirm tbody"),json) });
    document.getElementById("reset").addEventListener("click", function() { reset(json) });
    document.getElementById("restart").addEventListener("click", function() { softReset(json) });*/
}

// Call our async function when the DOM is ready.
document.addEventListener("DOMContentLoaded", function() {
    pageLoad();
});