// var body = document.querySelector("body");

// document.getElementById("mobile-menu").onclick = function () {

//     if (!body.classList.contains("toggle-menu")) {
//         body.classList.add("toggle-menu");


//     } else {

//         body.classList.remove("toggle-menu");
//     }
// }

var navbar = document.querySelector(".navbar");
var trigger = document.querySelector(".logo")

// document.getElementById("mobile-menu").onclick = function () {
trigger.onclick = function () {

    if (!navbar.classList.contains("navbar--open")) {
        navbar.classList.add("navbar--open");


    } else {

        navbar.classList.remove("navbar--open");
    }
}

// function overlay() {
//     if (body.classList.contains("toggle-menu")) {
//         body.classList.remove("toggle-menu");
//     }
// }

// //show tilmeld
// document.getElementById("show-tilmeld").onclick = function () {

//     if (!body.classList.contains("toggle-tilmeld")) {
//         body.classList.add("toggle-tilmeld");

//     }
// }
// //close tilmeld
// document.getElementById("close-tilmeld").onclick = function () {

//     if (body.classList.contains("toggle-tilmeld")) {
//         body.classList.remove("toggle-tilmeld");

//     }
// }