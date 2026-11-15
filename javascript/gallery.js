






//buttons animation//
const gallery = document.querySelector(".spain-gallery");
const photos = gallery.querySelectorAll("img");

let currentPhoto = 0;

function showPhoto(index) {

    currentPhoto = (index + photos.length) % photos.length;


    photos[currentPhoto].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
    });
}

document.querySelector(".left-arrow").addEventListener("click", function () {
    showPhoto(currentPhoto - 1);
});


document.querySelector(".right-arrow").addEventListener("click", function () {

  
    showPhoto(currentPhoto + 1);
});


document.querySelectorAll(".spain-dots a").forEach(function (dot, index) {

    dot.addEventListener("click", function (event) {
        event.preventDefault();
        showPhoto(index);
    });

});











/* SIMPLE SECTION SEARCH */

const searchButton = document.querySelector(".search-button");
const searchPanel = document.querySelector("#page-search");
const searchInput = document.querySelector("#search-input");
const findButton = document.querySelector("#find-section");
const closeButton = document.querySelector("#close-search");
const searchStatus = document.querySelector("#search-status");

function findSection() {
    const query = searchInput.value.trim().toLowerCase();

    const sections = {
        "home": "home",
        "front page": "home",
        "spain": "experiences",
        "sweden": "experiences",
        "stockholm": "experiences",
        "ukraine": "experiences",
        "riga": "experiences",
        "experiences": "experiences",
        "tips": "tips",
        "websites": "tips",
        "booking": "tips",
        "video": "video-journey",
        "travel": "video-journey",
        "japan": "destinations",
        "prague": "destinations",
        "italy": "destinations",
        "scotland": "destinations",
        "destinations": "destinations"
    };

    const sectionId = sections[query];

    if (sectionId) {
        document.getElementById(sectionId).scrollIntoView({
            behavior: "smooth"
        });

        searchStatus.textContent = "";
    } else {
        searchStatus.textContent = "Section not found. Try another word.";
    }
}

searchButton.addEventListener("click", function () {
    searchPanel.hidden = false;
    searchInput.focus();
});

findButton.addEventListener("click", findSection);

searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        findSection();
    }
});

closeButton.addEventListener("click", function () {
    searchPanel.hidden = true;
    searchInput.value = "";
    searchStatus.textContent = "";
});
