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

function displayTopics() {
    let topicRequest = new XMLHttpRequest();
    topicRequest.open('POST', './cgi-bin/topics.cgi', true);
    topicRequest.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    topicRequest.send(Date.now());
    console.log("sent request to server");
    topicRequest.onreadystatechange = function (oEvent) {
        if (topicRequest.readyState === 4) {
            if (topicRequest.status === 200) {
                console.log("Success! ",topicRequest.responseText);

                let requestData = JSON.parse(topicRequest.responseText);

                console.log(requestData);
                let container = document.querySelector("#checkbox-topics");
                let select = document.querySelector("#topic-select");

                for (var i = 0; i < requestData.topics.length; i++) {
                    var checkbox = document.createElement("div");
                    checkbox.classList.add("form-check");
                    checkbox.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" name=\"topic\" id=\"topic-" + requestData.topics[i].id + "\" value=\"" + requestData.topics[i].title + "\" />" +
                        "<label class=\"form-check-label\" for=\"topic-" + requestData.topics[i].id + "\">" + requestData.topics[i].title + "</label>";
                    container.appendChild(checkbox);
                    
                    var option = document.createElement("option");
                    option.innerText = requestData.topics[i].title;
                    option.setAttribute("value",requestData.topics[i].id);
                    select.appendChild(option);
                }
            } else {
                console.log("Error: ", topicRequest.statusText);
            }
        }
    };
}

function displayPosts(table, json) {

    clearTable(table);
    sortByAttribute(table, "[data-id]");

    console.log(json);

    let data = document.querySelectorAll("input[name=\"topic\"]:checked");;
    let topics = [];
    for (var i = 0; i < data.length; i++) {
        topics.push(data[i].value);
    }
    
    for (var t = 0; t < topics.length; t++){
        for (var i = 0; i < json.posts.length; i++) {
            if(json.posts[i].topic.localeCompare(topics[t], 'en', { sensitivity: 'base' }) == 0) {
                var tr = document.createElement('tr');
                tr.setAttribute("data-id",json.posts[i].postid );
                tr.setAttribute("data-author",json.posts[i].author);
                tr.setAttribute("data-topic",json.posts[i].topic);
                tr.setAttribute("data-timestamp",json.posts[i].timestamp);

                tr.innerHTML += "<td data-name=\"author\"></td>"
                tr.querySelector("[data-name=\"author\"]").innerText = json.posts[i].author;
                tr.innerHTML += "<td>" + json.posts[i].topic + "</td>";
                tr.innerHTML += "<td data-name=\"body\">";
                tr.querySelector("[data-name=\"body\"]").innerText = unescape(json.posts[i].body);
                tr.innerHTML += "</td>";
                tr.innerHTML += "<td>" + json.posts[i].timestamp + "</td>";
                table.appendChild(tr);
            }
        }
    }
}

async function sendRequest(data, url, step) {
    let xhr = new XMLHttpRequest();
    
    console.log("data: ", data);
    console.log("data to String: ", JSON.stringify(data));

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(data);
    console.log("sent request to server");
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

function escape(s) {
    return ('' + s)
        .replace(/\\/g, '\\\\')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\u00A0/g, '\\u00A0')
        .replace(/&/g, '\\x26')
        .replace(/'/g, '\\x27')
        .replace(/"/g, '\\x22')
        .replace(/</g, '\\x3C')
        .replace(/>/g, '\\x3E');
}

function unescape(s) {
    s = ('' + s)
       .replace(/\\x3E/g, '>')
       .replace(/\\x3C/g, '<')
       .replace(/\\x22/g, '"')
       .replace(/\\x27/g, "'")
       .replace(/\\x26/g, '&')
       .replace(/\\u00A0/g, '\u00A0')
       .replace(/\\n/g, '\n')
       .replace(/\\t/g, '\t');

    return s.replace(/\\\\/g, '\\');
}

async function handleResponse(xhr, step) {
    switch (step) {
        case 1:
            console.log("step 1"); //connecting
            document.querySelector("#connect").classList.add("hide");
            document.querySelector("#usertab").classList.remove("hide");
            document.querySelector("#topics").classList.remove("hide");
            document.querySelector("#username").innerText = document.querySelector("#getuser").value;
            document.querySelector("#connect-form").remove();
            var container = document.querySelector("#checkbox-topics");
            container.innerHTML = '';
            displayTopics();
            break;
        case 2:
            console.log("step 2 retrieve posts"); //updating display
            document.querySelector("#topics").classList.add("hide");
            document.querySelector("#posts").classList.remove("hide");
            displayPosts(document.querySelector("#post-list tbody"), JSON.parse(xhr.responseText));
            showAlert("Sucessfully retrieved posts.","success")
            break;
        case 3:
            console.log("step 3 create post");
            showAlert("Sucessfully created post. Update the display to see your post.","success");
            togglePostForm();
            break;
        default:
            console.log("something went wrong?");
    }
}

function sortByAttribute(table, attr) {
    // for most we can just compare the attribute values...
    [...table.children]
    .sort((a, b) => compareString(a.getAttribute(attr), b.getAttribute(attr)))
    .forEach(node => table.appendChild(node));
}

async function getJSON(url) {
    // fetching our json file, must not cache or it won't update product info when called again
    return fetch(url, {cache: "no-cache"})
        .then((response)=>response.json())
        .then((responseJson)=>{return responseJson});
}

function connect() {
    let user = document.querySelector("#getuser");
    if (user.value.length > 0) {
        sendRequest(escape(user.value), './cgi-bin/connect.cgi', 1);
    } else {
        alert("Please enter a name.");
    }
}

function showAlert(message, type) {
    var container = document.getElementById(type).cloneNode();
    document.getElementById("alerts").appendChild(container);
    container.innerText = message;
    container.classList.remove("hide");
    container.addEventListener("click", function() { container.classList.add("hide");container.remove(); });
    sleep(2500).then(() => { container.classList.add("hide");container.remove(); });
}

function fetchPosts() {
    let selected = document.querySelectorAll("input[name=\"topic\"]:checked");
    if (selected.length > 0) {
        document.querySelector("#update").disabled = false;
        sendRequest(selected, './cgi-bin/fetch.cgi', 2);
    } else {
        alert("Please select at least one topic");
    }
}

function togglePostForm() {
    document.querySelector("#make-post").classList.toggle("hide");
    document.querySelector("#form-post-content").value = "";
    document.querySelector("#form-post-content").focus();
    document.querySelector("#topic-select").options[0].selected = true;
    document.querySelector("#new-post").disabled = true;
}

function chooseDifferentTopics() {
    document.querySelector("#update").true = false;
    document.querySelector("#topics").classList.remove("hide");
    document.querySelector("#posts").classList.add("hide");
}

function createPost() {
    let postText = document.querySelector("#form-post-content");
    if (postText.value.length > 0) {
        let postJson = { "post" : {} };
        postJson.post.author = document.querySelector("#username").innerText;
        postJson.post.topic = escape(document.querySelector("#topic-select").value);
        postJson.post.body = postText.value;

        console.log("POST TO MAKE:\n" + JSON.stringify(postJson) + "\nbody stringified: " + JSON.stringify(postJson.body));
        sendRequest(JSON.stringify(postJson), './cgi-bin/new.cgi', 3);
    } else {
        alert("Can't make an empty post.");
    }
}

async function pageLoad() {
    // don't think this needs to be async anymore bc im not waiting for a .json file, but i'm not messing with it lol
    document.getElementById("getuser").value = "";
    document.getElementById("getuser").focus();
    document.querySelectorAll("button").forEach((element) => element.disabled = false );
    document.querySelector("#update").disabled = true;
    document.getElementById("connect").addEventListener("click", function() { connect() });
    document.getElementById("pick-topics").addEventListener("click", function() { fetchPosts() });
    document.getElementById("update").addEventListener("click", function() { fetchPosts(); });
    document.getElementById("new").addEventListener("click", function() { togglePostForm(); });
    document.getElementById("new-post").addEventListener("click", function() { createPost(); });
    document.querySelector("#make-post .btn-close").addEventListener("click", function() { togglePostForm(); });
    document.getElementById("change-topics").addEventListener("click", function() { chooseDifferentTopics(); });
    document.getElementById("form-post-content").addEventListener('input', () => document.getElementById("new-post").disabled = document.getElementById("form-post-content").value === '');
}

// Call our async function when the DOM is ready.
document.addEventListener("DOMContentLoaded", function() {
    pageLoad();
});