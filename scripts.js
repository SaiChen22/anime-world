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

const defaultState = {
  search: "",
  filters: { genre: "", type: "" },
  sort: { by: "score", order: "desc" },
  pagination: { currentPage: 1, pageSize: 20 },
};

const state = {
  search: defaultState.search,
  filters: { ...defaultState.filters },
  sort: { ...defaultState.sort },
  pagination: { ...defaultState.pagination },
};

// Populated once at init; never changes after that
//page-wide data that we can use for filtering and sorting
let allGenres = [];
let allTypes = [];
let animeData = [];

//------------------Data Pipeline------------------
//function that takes in the raw data and returns the data that should be rendered on the page based on the current state
function filterData(data, state) {
  return data.filter((anime) => {
    const search = state.search.toLowerCase().trim();
    const studioNames = Array.isArray(anime.studios) ? anime.studios : [];

    const matchesSearch = search === "" ||
      (anime.title || "").toLowerCase().includes(search) ||
      (anime.titleJP || "").toLowerCase().includes(search) ||
      studioNames.some(studio => studio.toLowerCase().trim().includes(search));


    const matchesGenre = state.filters.genre ? anime.genres.includes(state.filters.genre) : true;
    const matchesType = state.filters.type ? anime.type === state.filters.type : true;

    return matchesSearch && matchesGenre && matchesType;
  })
}

//function that takes in the filtered data and returns it sorted based on the current sort state
function sortData(data, sortState) {
  const { by, order } = sortState;

  const sortedData = [...data].sort((a, b) => {
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

//function that takes in the sorted data and returns it paginated based on the current pagination state
function paginateData(data, paginationState) {
  const { currentPage, pageSize } = paginationState;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const items = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / pageSize);

  return { items, totalPages };
}

//----------Init Helpers----------------------
//helper function to get all unique values for a given field in the data; used for populating filter dropdowns
function getUniqueValues(data, field) {
  const values = new Set();
  data.forEach((item) => {
    if (field === "genres") {
      item.genres.forEach((genre) => values.add(genre));
    } else {
      values.add(item[field]);
    }
  });
  return [...values].sort();
}

async function loadAnimeData() {
  const response = await fetch("data.json");
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
  card.className = "card";

  const scoreText = anime.score != null ? anime.score.toFixed(2) : "N/A";
  const yearText = anime.year != null ? anime.year : "—";
  const popularityText = anime.popularity != null ? anime.popularity : "N/A";
  const synopsisText = anime.synopsis ? anime.synopsis : "No synopsis available.";
  const studiosText = Array.isArray(anime.studios) && anime.studios.length > 0
    ? anime.studios.join(", ")
    : "N/A";

  const genreTags = anime.genres
    .map(g => `<span class="genre-tag">${g}</span>`)
    .join("");

  card.innerHTML = `
    <a class="card-image-link" href="${anime.malUrl}" target="_blank" rel="noopener">
      <img src="${anime.imageUrl}" alt="${anime.title} poster" loading="lazy" />
    </a>
    <div class="card-content">
      <h2><a href="${anime.malUrl}" target="_blank" rel="noopener">${anime.title}</a></h2>
      <p class="title-jp">${anime.titleJP}</p>

      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Type</span>
          <span class="stat-value">${anime.type || "N/A"}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Year</span>
          <span class="stat-value">${yearText}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Score</span>
          <span class="stat-value">${scoreText}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Popularity</span>
          <span class="stat-value">${popularityText}</span>
        </div>
      </div>
      <p class="studio-line">
        <span class="studio-label">Studios:</span> ${studiosText}
      </p>

      <div class="genres">${genreTags}</div>
      <p class="synopsis">${synopsisText}</p>
    </div>
  `;
  return card;
}

//helper function to populate the filter dropdowns based on the unique genres and types in the data
function populateFilters(genres, types) {
  const genreSelect = document.getElementById("genre-select");
  const typeSelect = document.getElementById("type-select");

  genreSelect.innerHTML = `<option value="">All Genres</option>`;
  typeSelect.innerHTML = `<option value="">All Types</option>`;

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
  const bar = document.getElementById("pagination-bar");
  const pageSizeControl = document.querySelector(".page-size-control");
  const container = document.getElementById("pagination");
  container.innerHTML = "";
  if (totalPages <= 1) {
    bar.style.display = "none";
    if (pageSizeControl) {
      pageSizeControl.style.display = "none";
    }
    return;
  }

  bar.style.display = "flex";
  if (pageSizeControl) {
    pageSizeControl.style.display = "inline-flex";
  }

  const addBtn = (label, page, disabled, active) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = "page-btn" + (active ? " active" : "");
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
      ellipsis.className = "ellipsis";
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
  const end = Math.min(currentPage * pageSize, filteredCount);
  resultCount.textContent = `Showing ${start}–${end} of ${filteredCount} results`;
}

//-------------------------Event Handlers----------------------------------------------------
//search input handler; updates state and triggers re-render on every keystroke
function onSearchInput(e) {
  state.search = e.target.value.trim();
  state.pagination.currentPage = 1;
  render();
}

//filter change handler; updates state and triggers re-render when either filter dropdown changes
function onFilterChange(e) {
  if (e.target.id === "genre-select") {
    state.filters.genre = e.target.value;
  } else if (e.target.id === "type-select") {
    state.filters.type = e.target.value;
  }
  state.pagination.currentPage = 1;
  render();
}

//sort change handler; updates state and triggers re-render when sort dropdown changes
function onSortChange(e) {
  const [by, order] = e.target.value.split("-");
  state.sort.by = by;
  state.sort.order = order;
  render();
}

//pagination button handler; updates state and triggers re-render when a pagination button is clicked; also scrolls to top of page
function onPageChange(newPage) {
  state.pagination.currentPage = newPage;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

//header click handler; resets all filters and search and goes back to page 1
function onHeaderActivate() {
  onReset();
}

// Resets all UI controls to match the current state values; useful after programmatically changing state.
function syncControlsToState() {
  document.getElementById("search-bar").value = state.search;
  document.getElementById("genre-select").value = state.filters.genre;
  document.getElementById("type-select").value = state.filters.type;
  document.getElementById("sort-select").value = `${state.sort.by}-${state.sort.order}`;
  document.getElementById("page-size-select").value = String(state.pagination.pageSize);
  
}

// Reset button handler; resets state to default values and syncs controls, then re-renders and scrolls to top.
function onReset() {
  state.search = defaultState.search;
  state.filters.genre = defaultState.filters.genre;
  state.filters.type = defaultState.filters.type;
  state.sort.by = defaultState.sort.by;
  state.sort.order = defaultState.sort.order;
  state.pagination.currentPage = defaultState.pagination.currentPage;
  state.pagination.pageSize = defaultState.pagination.pageSize;

  syncControlsToState();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Page size change handler; updates state and triggers re-render when page size dropdown changes; also resets to page 1 and scrolls to top.
function onPageSizeChange(e) {
  const newPageSize = Number.parseInt(e.target.value, 10);
  if (!Number.isFinite(newPageSize) || newPageSize <= 0) {
    return;
  }

  state.pagination.pageSize = newPageSize;
  state.pagination.currentPage = 1;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Clear search button handler; clears the search input and resets to page 1, but keeps filters and sort intact.
function onClearSearch() {
  if (state.search === "") {
    return;
  }

  state.search = "";
  state.pagination.currentPage = 1;
  syncControlsToState();
  render();
}


//------------------Initialization------------------
async function init() {
  try {
    await loadAnimeData();
    availableGenres = getUniqueValues(animeData, "genres");
    allTypes = getUniqueValues(animeData, "type");

    populateFilters(availableGenres, allTypes);
    syncControlsToState();

    const header = document.querySelector(".main-header");
    header.addEventListener("click", onHeaderActivate);

    document.getElementById("search-bar").addEventListener("input", onSearchInput);
    document.getElementById("clear-search").addEventListener("click", onClearSearch);
    document.getElementById("reset-button").addEventListener("click", onReset);
    document.getElementById("genre-select").addEventListener("change", onFilterChange);
    document.getElementById("type-select").addEventListener("change", onFilterChange);
    document.getElementById("sort-select").addEventListener("change", onSortChange);
    document.getElementById("page-size-select").addEventListener("change", onPageSizeChange);

    render();
  } catch (error) {
    console.error(error);
    document.getElementById("result-count").textContent =
      "Unable to load data.json. Open this project with a local web server.";
  }

}

document.addEventListener("DOMContentLoaded", init);

