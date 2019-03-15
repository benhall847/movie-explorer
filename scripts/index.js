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

targetInput.focus();



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
