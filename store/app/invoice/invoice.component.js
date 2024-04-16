angular.
  module('storeApp').
  component('invoice', {
    // Note: The URL is relative to our `index.html` file
    templateUrl: 'invoice/invoice.template.html',
    controller: async function InvoiceController() {
        invoicePageLoad();
    }
  });

function displayInvoice(table, json) {

    clearTable(table);

    for (var i = 0; i < json.ORDER.length; i++) {
        var tr = document.createElement('tr');
        tr.setAttribute("data-id",json.ORDER[i].id );
        tr.setAttribute("data-name",json.ORDER[i].name);
        tr.setAttribute("data-category",json.ORDER[i].category);
        tr.setAttribute("data-cost",json.ORDER[i].cost);
        tr.setAttribute("data-quantity",json.ORDER[i].quantity);


        tr.innerHTML = "<td>" + json.ORDER[i].id + "</td>";
        tr.innerHTML += "<td data-name=\"name\">" + json.ORDER[i].name + "</td>";
        tr.innerHTML += "<td>" + json.ORDER[i].category + "</td>";
        tr.innerHTML += "<td>" + USDollar.format(json.ORDER[i].cost) + "</td>";
        tr.innerHTML += "<td class=\"text-end\">" + json.ORDER[i].quantity + "</td>";
        table.appendChild(tr);
    }
    //sortByAttribute(table, "[data-id]");
    document.querySelector("#subtotal").innerText = USDollar.format(json.INFO.subtotal);
    document.querySelector("#timestamp").innerText = json.INFO.timestamp;
    document.querySelector("#order-id").innerText = json.INFO.id;
    document.querySelector("#invoice").classList.remove("hide");
    order = '';
}

async function sendInvoiceRequest(data) {
    const url = "/~sullivb/cgi-bin/hw/invoice.cgi";
    let xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(data);

    console.log("requesting HTML from server");

    xhr.onreadystatechange = function (oEvent) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                handleInvoiceResponse(xhr);
            } else {
                console.log("Error", xhr.statusText);
            }
        }
    };
}

async function handleInvoiceResponse(xhr) {
    try {
        var json = JSON.parse(xhr.responseText);
    } catch(error) {
        console.error("Order does not exist.");
        order = '';
        document.querySelector("#error").classList.remove("hide");
        return;
    }
    displayInvoice(document.querySelector("#order tbody"), json);
}

async function loadInvoice(orderID) {
    sendInvoiceRequest(orderID);
}

function getInvoice() {
    var orderID = document.querySelector("#order-id-input").value;
    window.location.href = "#!/invoice?order=" + orderID;
    loadInvoice(orderID);
}

function invoicePageLoad() {

    let url = new URL(window.location.href);
    console.log("invoice url is " + url);
    let params = new URLSearchParams(url);
    console.log("invoice params is " + params);
    console.log("does params have order? " + params.has("order"));

    if (params.has("order") || order.length > 0) {
        console.log ("Order ID found!");
        loadInvoice(order);
    } else {
        console.log ("No Order ID found");
        document.querySelector("#generate").classList.remove("hide");
    }
    
    document.getElementById("get-order").addEventListener("click", function() { getInvoice() });
}