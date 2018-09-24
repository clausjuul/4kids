// var body = document.querySelector("body");

// document.getElementById("mobile-menu").onclick = function () {

//     if (!body.classList.contains("toggle-menu")) {
//         body.classList.add("toggle-menu");


//     } else {

//         body.classList.remove("toggle-menu");
//     }
// }

var navbar = document.querySelector(".navbar");
var trigger = document.querySelector(".navbar__open-button")

// document.getElementById("mobile-menu").onclick = function () {
trigger.onclick = function () {
    navbar.classList.toggle("navbar--open");
}

// document.getElementById('toggleMenu').addEventListener('click', function () {

//     if (!this.classList.contains('playMenu')) {
//       this.classList.add('playMenu');
//       this.classList.remove('playMenuReverse');
//     } else {
//       this.classList.add('playMenuReverse');
//       this.classList.remove('playMenu');
//     }

//   });

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