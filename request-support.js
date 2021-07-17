/* TODO: The first parameter gets ignored
and URLSearchParams() doesn't work on IE.
Find a better way to extract the URL Parameters.
*/
var url_parameters = new URLSearchParams(window.location.href);

// Change the Title of the page based on the addon name and error code.
function changeTitle(addon_name) {
    document.title = addon_name + " - Error when checking for Updates";
}

// Add the name of the Addon into the webpage.
function changeAddonname(addon_name) {
    let addon_name_elements = document.getElementsByClassName("addon_name");

    for (let index = 0; index < addon_name_elements.length; index++) {
        document.getElementsByClassName("addon_name")[index].innerHTML = addon_name;
    }
}

// Change the contents of the page head.
function changeHead() {
    if (url_parameters.has('addon_name')) {
        changeTitle(url_parameters.get('addon_name'));
    }
}

// Change the contents of the page body.
function changeBody() {
    if (url_parameters.has('addon_name')) {
        changeAddonname(url_parameters.get('addon_name'));
    }
}