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
const animeData = [
  {
    "id": 52991,
    "title": "Sousou no Frieren",
    "titleJP": "葬送のフリーレン",
    "type": "TV",
    "episodes": 28,
    "score": 9.27,
    "scoredBy": 873408,
    "rank": 1,
    "popularity": 104,
    "year": 2023,
    "season": "fall",
    "status": "Finished Airing",
    "rating": "PG-13 - Teens 13 or older",
    "genres": [
      "Adventure",
      "Award Winning",
      "Drama",
      "Fantasy"
    ],
    "themes": [],
    "studios": [
      "Madhouse"
    ],
    "synopsis": "During their decade-long quest to defeat the Demon King, the members of the hero's party—Himmel himself, the priest Heiter, the dwarf warrior Eisen, and the elven mage Frieren—forge bonds through adventures and battles, creating unforgettable precious memories for most of them.  However, the time that Frieren spends with her comrades is equivalent to merely a fraction of her life, which has lasted...",
    "imageUrl": "https://myanimelist.net/images/anime/1015/138006l.jpg",
    "malUrl": "https://myanimelist.net/anime/52991/Sousou_no_Frieren"
  },
  {
    "id": 61469,
    "title": "Steel Ball Run: JoJo no Kimyou na Bouken",
    "titleJP": "スティール・ボール・ラン ジョジョの奇妙な冒険",
    "type": "ONA",
    "episodes": null,
    "score": 9.15,
    "scoredBy": 88238,
    "rank": 2,
    "popularity": 1430,
    "year": 2026,
    "season": null,
    "status": "Currently Airing",
    "rating": "R - 17+ (violence & profanity)",
    "genres": [
      "Action",
      "Adventure",
      "Mystery",
      "Supernatural"
    ],
    "themes": [
      "Historical",
      "Racing"
    ],
    "studios": [
      "David Production"
    ],
    "synopsis": "In the American Old West, the world's greatest race is about to begin. Thousands line up in San Diego to travel over six thousand kilometers for a chance to win the grand prize of fifty million dollars. With the era of the horse reaching its end, contestants are allowed to use any kind of vehicle they wish. Competitors will have to endure grueling conditions, traveling up to a hundred kilometers a...",
    "imageUrl": "https://myanimelist.net/images/anime/1448/154111l.jpg",
    "malUrl": "https://myanimelist.net/anime/61469/Steel_Ball_Run__JoJo_no_Kimyou_na_Bouken"
  },
  {
    "id": 5114,
    "title": "Fullmetal Alchemist: Brotherhood",
    "titleJP": "鋼の錬金術師 FULLMETAL ALCHEMIST",
    "type": "TV",
    "episodes": 64,
    "score": 9.11,
    "scoredBy": 2305377,
    "rank": 3,
    "popularity": 3,
    "year": 2009,
    "season": "spring",
    "status": "Finished Airing",
    "rating": "R - 17+ (violence & profanity)",
    "genres": [
      "Action",
      "Adventure",
      "Drama",
      "Fantasy"
    ],
    "themes": [
      "Military"
    ],
    "studios": [
      "Bones"
    ],
    "synopsis": "After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in a catastrophic new reality. Ignoring the alchemical principle banning human transmutation, the boys attempted to bring their recently deceased mother back to life. Instead, they suffered brutal personal loss: Alphonse's body disintegrated while Edward lost a leg and then sacrificed an ar...",
    "imageUrl": "https://myanimelist.net/images/anime/1208/94745l.jpg",
    "malUrl": "https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood"
  },
  {
    "id": 57555,
    "title": "Chainsaw Man Movie: Reze-hen",
    "titleJP": "劇場版 チェンソーマン レゼ篇",
    "type": "Movie",
    "episodes": 1,
    "score": 9.08,
    "scoredBy": 286220,
    "rank": 4,
    "popularity": 584,
    "year": 2025,
    "season": null,
    "status": "Finished Airing",
    "rating": "R - 17+ (violence & profanity)",
    "genres": [
      "Action",
      "Fantasy"
    ],
    "themes": [
      "Gore",
      "Urban Fantasy"
    ],
    "studios": [
      "MAPPA"
    ],
    "synopsis": "Despite the immediate challenges following becoming a devil hunter with the Public Safety Bureau, Denji has quickly adapted to his new life and responsibilities. As the chaos of Denji's first ordeal with Public Safety settles down, the elite devil hunter Makima decides to take Denji out on a date. Although the date strengthens his affection for Makima and he swears to not fall in love with anyone ...",
    "imageUrl": "https://myanimelist.net/images/anime/1763/150638l.jpg",
    "malUrl": "https://myanimelist.net/anime/57555/Chainsaw_Man_Movie__Reze-hen"
  },
  {
    "id": 9253,
    "title": "Steins;Gate",
    "titleJP": "STEINS;GATE",
    "type": "TV",
    "episodes": 24,
    "score": 9.07,
    "scoredBy": 1517241,
    "rank": 5,
    "popularity": 14,
    "year": 2011,
    "season": "spring",
    "status": "Finished Airing",
    "rating": "PG-13 - Teens 13 or older",
    "genres": [
      "Drama",
      "Sci-Fi",
      "Suspense"
    ],
    "themes": [
      "Psychological",
      "Time Travel"
    ],
    "studios": [
      "White Fox"
    ],
    "synopsis": "Eccentric scientist Rintarou Okabe has a never-ending thirst for scientific exploration. Together with his ditzy but well-meaning friend Mayuri Shiina and his roommate Itaru Hashida, Okabe founds the Future Gadget Laboratory in the hopes of creating technological innovations that baffle the human psyche. Despite claims of grandeur, the only notable \"gadget\" the trio have created is a microwave tha...",
    "imageUrl": "https://myanimelist.net/images/anime/1935/127974l.jpg",
    "malUrl": "https://myanimelist.net/anime/9253/Steins_Gate"
  },
  {
    "id": 38524,
    "title": "Shingeki no Kyojin Season 3 Part 2",
    "titleJP": "進撃の巨人 Season3 Part.2",
    "type": "TV",
    "episodes": 10,
    "score": 9.05,
    "scoredBy": 1787366,
    "rank": 8,
    "popularity": 20,
    "year": 2019,
    "season": "spring",
    "status": "Finished Airing",
    "rating": "R - 17+ (violence & profanity)",
    "genres": [
      "Action",
      "Drama",
      "Suspense"
    ],
    "themes": [
      "Gore",
      "Military",
      "Survival"
    ],
    "studios": [
      "Wit Studio"
    ],
    "synopsis": "Seeking to restore humanity's diminishing hope, the Survey Corps embark on a mission to retake Wall Maria, where the battle against the merciless \"Titans\" takes the stage once again.  Returning to the tattered Shiganshina District that was once his home, Eren Yeager and the Corps find the town oddly unoccupied by Titans. Even after the outer gate is plugged, they strangely encounter no opposition....",
    "imageUrl": "https://myanimelist.net/images/anime/1517/100633l.jpg",
    "malUrl": "https://myanimelist.net/anime/38524/Shingeki_no_Kyojin_Season_3_Part_2"
  },
  {
    "id": 28977,
    "title": "Gintama°",
    "titleJP": "銀魂°",
    "type": "TV",
    "episodes": 51,
    "score": 9.05,
    "scoredBy": 272286,
    "rank": 7,
    "popularity": 349,
    "year": 2015,
    "season": "spring",
    "status": "Finished Airing",
    "rating": "PG-13 - Teens 13 or older",
    "genres": [
      "Action",
      "Comedy",
      "Sci-Fi"
    ],
    "themes": [
      "Gag Humor",
      "Historical",
      "Parody",
      "Samurai"
    ],
    "studios": [
      "Bandai Namco Pictures"
    ],
    "synopsis": "Gintoki, Shinpachi, and Kagura return as the fun-loving but broke members of the Yorozuya team! Living in an alternate-reality Edo, where swords are prohibited and alien overlords have conquered Japan, they try to thrive on doing whatever work they can get their hands on. However, Shinpachi and Kagura still haven't been paid... Does Gin-chan really spend all that cash playing pachinko?  Meanwhile,...",
    "imageUrl": "https://myanimelist.net/images/anime/3/72078l.jpg",
    "malUrl": "https://myanimelist.net/anime/28977/Gintama°"
  },
  {
    "id": 39486,
    "title": "Gintama: The Final",
    "titleJP": "銀魂 THE FINAL",
    "type": "Movie",
    "episodes": 1,
    "score": 9.05,
    "scoredBy": 86889,
    "rank": 6,
    "popularity": 1501,
    "year": 2021,
    "season": null,
    "status": "Finished Airing",
    "rating": "PG-13 - Teens 13 or older",
    "genres": [
      "Action",
      "Comedy",
      "Drama",
      "Sci-Fi"
    ],
    "themes": [
      "Gag Humor",
      "Historical",
      "Parody",
      "Samurai"
    ],
    "studios": [
      "Bandai Namco Pictures"
    ],
    "synopsis": "Two years have passed following the Tendoshuu's invasion of the O-Edo Central Terminal. Since then, the Yorozuya have gone their separate ways. Foreseeing Utsuro's return, Gintoki Sakata begins surveying Earth's ley lines for traces of the other man's Altana. After an encounter with the remnants of the Tendoshuu—who continue to press on in search of immortality—Gintoki returns to Edo.  Later, the ...",
    "imageUrl": "https://myanimelist.net/images/anime/1245/116760l.jpg",
    "malUrl": "https://myanimelist.net/anime/39486/Gintama__The_Final"
  }];

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
  const [by,order] = sortState;

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

//------------------Render------------------
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



//------------------Initialization------------------
function init(){
  allGenres = getUniqueValues(animeData,"genres");
  allTypes = getUniqueValues(animeData,"type");
  populateFilters(allGenres,allTypes);


}

document.addEventListener("DOMContentLoaded", init);

