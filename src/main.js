"use strict";

import "./styles/styles.styl"

const newsSection = document.querySelector(".news");
const searchInput = document.querySelector(".search-bar__input");
const pageSelect = document.querySelector(".page-select");
const newsPagination = document.querySelector(".news-pagination");

let list = [];
let pageList = [];
let currentPage = 1;
let numberPerPage = 6;
let numberOfPages = 1;

const noResults = document.createElement("p");
noResults.classList.add("no-results-info");
noResults.innerText = "No results...";

const apiKey = "ea1a93cd-5833-4baa-ad37-a419fc9c3a96";
const twoWeeksAgo = new Date(Date.now() - 12096e5);
const twoWeeksAgoFormat = twoWeeksAgo.getFullYear() + "-" + (twoWeeksAgo.getMonth() + 1) + "-" + twoWeeksAgo.getDate();

fetch(`https://content.guardianapis.com/search?from-date=${twoWeeksAgoFormat}&page-size=100&api-key=${apiKey}`)
    .then(resp => resp.json())
    .then(resp => {
        list = [...resp.response.results];
        load();
    })
    .catch(error => newsSection.innerHTML = `<p style="color:red; font-size: 12px; text-align:center;">${error}</p>`);

searchInput.addEventListener("keyup", (event) => {
    fetch(`https://content.guardianapis.com/search?from-date=${twoWeeksAgoFormat}&page-size=100${event.target.value.length > 0 ? "&q=" + event.target.value : ""}&order-by=newest&api-key=${apiKey}`)
        .then(resp => resp.json())
        .then(resp => {
            list = [...resp.response.results];
            load();
        })
        .catch(error => newsSection.innerHTML = `<p style="color:red; font-size: 12px; text-align:center;">${error}</p>`);
});

const getNumberOfPages = () => Math.ceil(list.length / numberPerPage);

const loadList = () => {
    const begin = ((currentPage - 1) * numberPerPage);
    const end = begin + numberPerPage;
    pageList = list.slice(begin, end);
    drawList();
}

const drawList = () => {
    newsSection.innerHTML = "";

    pageList.forEach(news => {
        let article = document.createElement("article");
        article.classList.add("news-single");

        article.innerHTML = `
            <div class="row news-single-top">
                <p class="news-section-name">${news.sectionName}</p>
                <p class="news-date">${news.webPublicationDate.slice(0,-10)}</p>
            </div>
            <div class="row news-title-wrapper">
                <a href="${news.webUrl}" class="news-title">${news.webTitle}</a>
            </div>
            <div class="row">
                <a href="${news.webUrl}" class="news-more-button">Read more</a>
            </div>
        `;

        newsSection.appendChild(article);
    })

    if (list.length === 0) {
        newsSection.appendChild(noResults);
        newsPagination.style.display = "none";
    } else {
        newsPagination.style.display = "block";
        printPages();
    }
}

const load = () => {
    numberOfPages = getNumberOfPages();
    loadList();
}

const printPages = () => {
    pageSelect.innerHTML = "";
    for (let i = 1; i <= numberOfPages; i++) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.text = i;
        pageSelect.add(opt);
        if (opt.value === currentPage) {
            opt.setAttribute("selected", "true");
        }
    }
}

pageSelect.addEventListener("change", (event) => {
    currentPage = event.target.value;
    loadList();
})