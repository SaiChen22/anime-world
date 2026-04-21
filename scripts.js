/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

//---------------------------State---------------------------
//Single source of truth for all UI statue.

const state = {
  search: "",
  filters: { genre: "", type: "" },
  sort: { by: "score", order: "desc" },
  pagination: { currentPage: 1, pageSize: 20 },
};

// Populated once at init; never changes after that
//page-wide data that we can use for filtering and sorting
let allGenres = [];
let allTypes  = [];
let animeData = [];

//------------------Data Pipeline------------------
//function that takes in the raw data and returns the data that should be rendered on the page based on the current state
function filterData(data,state){
  return data.filter((anime) => {
    const matchesSearch = anime.title.toLowerCase().includes(state.search.toLowerCase());
    const matchesGenre = state.filters.genre ? anime.genres.includes(state.filters.genre) : true;
    const matchesType = state.filters.type ? anime.type === state.filters.type : true;

    return matchesSearch && matchesGenre && matchesType;
  })
}

function sortData(data,sortState){
  const {by,order} = sortState;

  const sortedData = [...data].sort((a,b) => {
    const aValue = a[by];
    const bValue = b[by];

    //handle null values
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    let multiplier = order === "asc" ? 1 : -1;
    
    return multiplier * (aValue - bValue);

  });

  return sortedData;
}

function paginateData(data,paginationState){
  const {currentPage,pageSize} = paginationState;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const items = data.slice(startIndex,endIndex);
  const totalPages = Math.ceil(data.length / pageSize);

  return {items,totalPages};
}

//----------Init Helpers----------------------
//helper function to get all unique values for a given field in the data; used for populating filter dropdowns
function getUniqueValues(data,field){
  const values = new Set();   
  data.forEach((item) => {
    if(field === "genres"){
      item.genres.forEach((genre) => values.add(genre));
    } else {
      values.add(item[field]);
    }
  });
  return [...values].sort();
}

async function loadAnimeData() {
  const response = await fetch("data.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load data.json (${response.status})`);
  }
  animeData = await response.json();
}

//------------------Render------------------
// Main render function that runs the entire data pipeline and updates the DOM; should be called whenever state changes.
function render() {
  const filtered = filterData(animeData, state);
  const sorted = sortData(filtered, state.sort);
  const { items, totalPages } = paginateData(sorted, state.pagination);

  renderCards(items);
  renderPagination(totalPages, state.pagination.currentPage);
  renderResultCount(filtered.length);
}

// Builds and appends card DOM elements for each anime in the given list of items.
function renderCards(items) {
  const container = document.getElementById("card-container");
  container.innerHTML = "";
  for (const anime of items) {
    container.appendChild(createCard(anime));
  }
}

// Builds a single card DOM element from one anime object.
function createCard(anime) {
  const card = document.createElement("div");

  const scoreText = anime.score != null ? anime.score.toFixed(2) : "N/A";
  const yearText = anime.year != null ? anime.year : "—";
  const popularityText = anime.popularity != null ? anime.popularity : "N/A";
  const synopsisText = anime.synopsis ? anime.synopsis : "No synopsis available.";

  const genreTags = anime.genres
    .map(g => `<span class="genre-tag">${g}</span>`)
    .join("");

  card.innerHTML = `
    <img class="anime-image" src="${anime.image_url}" alt="${anime.title} cover image" />
  `;
  return card;
}

//helper function to populate the filter dropdowns based on the unique genres and types in the data
function populateFilters(genres,types){
  const genreSelect = document.getElementById("genre-select");
  const typeSelect = document.getElementById("type-select");

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
  });

  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
}

// Renders Prev / page numbers (windowed ±2 around current) / Next.
function renderPagination(totalPages, currentPage) {
  const container = document.getElementById("pagination");
  container.innerHTML = "";
  if (totalPages <= 1) return;

  const addBtn = (label, page, disabled, active) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.disabled = disabled;
    if (!disabled) btn.addEventListener("click", () => onPageChange(page));
    container.appendChild(btn);
  };

  addBtn("← Prev", currentPage - 1, currentPage === 1, false);

  // Show first, last, and a ±2 window around the current page
  const pageSet = new Set([1, totalPages]);
  for (let p = Math.max(1, currentPage - 2); p <= Math.min(totalPages, currentPage + 2); p++) {
    pageSet.add(p);
  }

  let prev = 0;
  for (const p of [...pageSet].sort((a, b) => a - b)) {
    if (p - prev > 1) {
      const ellipsis = document.createElement("span");
      ellipsis.textContent = "…";
      container.appendChild(ellipsis);
    }
    addBtn(p, p, false, p === currentPage);
    prev = p;
  }

  addBtn("Next →", currentPage + 1, currentPage === totalPages, false);
}

// Updates the "Showing X–Y of Z results" text based on the filtered count and pagination.
function renderResultCount(filteredCount) {
  const resultCount = document.getElementById("result-count");
  const { currentPage, pageSize } = state.pagination;
  if (filteredCount === 0) {
    resultCount.textContent = "No results found";
    return;
  }
  const start = (currentPage - 1) * pageSize + 1;
  const end   = Math.min(currentPage * pageSize, filteredCount);
  resultCount.textContent = `Showing ${start}–${end} of ${filteredCount} results`;
}



//------------------Initialization------------------
async function init(){
  await loadAnimeData();
  allGenres = getUniqueValues(animeData,"genres");
  allTypes = getUniqueValues(animeData,"type");

  populateFilters(allGenres,allTypes);
  
  render();

}

document.addEventListener("DOMContentLoaded", init);

