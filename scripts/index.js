const listArea = document.querySelector("[data-list]");

const imgURL = "https://image.tmdb.org/t/p/w200";

const modal = document.querySelector("[data-modal]");
const modalFrame = document.querySelector("[data-modalFrame]");
const videoFrame = document.querySelector("[data-videoFrame]");
const iframe = document.createElement('iframe');
iframe.setAttribute('class', 'iframeVideo');

const span = document.querySelector("[data-modalClose]");
const modalInfo = document.querySelector("[data-modalContent]");
let trendingList;

videoFrame.appendChild(iframe);
span.addEventListener("click", closeModal);

const targetInput = document.querySelector("[data-searchBar]"),

results = document.querySelector("[data-autocomplete-results]");

let matches = [];

// focus the input
targetInput.focus();

function getMatches(inputText) {
    let matchList = [];
    let lowerCasedInputText = inputText.toLowerCase();
    console.log(`inside getMatches, trendingList: ${trendingList}`);

    trendingList.forEach(movie => {
        if (movie.title) {
            // will only search through movies, not shows.
            // if the movie title [string] contains part of the input text
            if (movie.title.toLowerCase().indexOf(lowerCasedInputText) > -1) {
                matchList.push(movie);
            }
        }
    });
    return matchList; // array of matches
}

// populate autocomplete results, accepts matchList array as an argument
function displayMatches(matchList) {
    matchList.forEach(match => {
        const liElement = document.createElement("li");
        liElement.textContent = match.title;
        results.appendChild(liElement);
    });
}

function closeModal(){
    modal.style.display = "none";
    iframe.src = ``;
}


function posterClick(event) {
    let youtubeURL = event.target.video.results[0].key;
    modal.style.display = "block";
    iframe.src = `https://www.youtube.com/embed/${youtubeURL}`;
}


function createIMGelement(obj) {
    const aDiv = document.createElement("div");
    const myImg = document.createElement("img");
    listArea.appendChild(aDiv);
    myImg.setAttribute("src", `${imgURL}${obj.poster_path}`);
    aDiv.setAttribute("class", "poster-frame");
    myImg.setAttribute("class", "poster-image");
    myImg.data = obj;
    aDiv.appendChild(myImg);
    myImg.addEventListener("click", posterClick);

    fetch(`https://api.themoviedb.org/3/movie/${obj.id}/videos?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e&language=en-US`)
        .then((response) =>{
            return response.json()
        })
        .then((data) => {
            myImg.video = data;
        });
    }

    function createElements(myArray) {
    myArray.forEach(movieObj => {
        createIMGelement(movieObj);
    });
    }

    function sortPopularity(a, b) {

    if (a.popularity > b.popularity) {
        return -1;
    }
    if (b.popularity > a.popularity) {
        return 1;
    }
    return 0;
    }

    const ListSpike = fetch(
    "https://api.themoviedb.org/3/trending/all/week?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e"
    )
    .then(response => {
        return response.json();
    })
    .then(data => {
        trendingList = data.results;
        trendingList.sort(sortPopularity);
        createElements(trendingList);
    });

function search(event) {
    const searchInput = event.srcElement.value;
    results.innerHTML = "";
    fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e&language=en-US&query=${searchInput}&page=1&include_adult=false`
    );
    if (event.srcElement.value.length > 0) {
        matches = getMatches(event.srcElement.value);
        if (matches.length > 0) {
            displayMatches(matches);
        }
    }
}

targetInput.addEventListener("keyup", search);
