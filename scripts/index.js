const listArea = document.querySelector("[data-list]");

const imgURL = "https://image.tmdb.org/t/p/w200";

let trendingList;

const targetInput = document.querySelector("[data-searchBar]"),
  results = document.querySelector("[data-autocomplete-results]");

let matches = [];

// focus the input
targetInput.focus();

// displays autocomplete results

// toggles the results list
function toggleResults(action) {
  if (action == "show") {
    results.classList.add("visible");
  } else if (action == "hide") {
    results.classList.remove("visible");
  }
}

function getMatches(inputText) {
  let matchList = [];
  let lowerCasedInputText = inputText.toLowerCase();

  //   console.log("in getMatches");
  //   console.log(inputText);
  //   console.log(lowerCasedInputText);
  console.log(`inside getMatches, trendingList: ${trendingList}`);

  trendingList.forEach(movie => {
    console.log(movie);
    console.log(movie.title);
    if (movie.title) {
      // will only search through movies, not shows.
      // if the movie title [string] contains part of the input text
      if (movie.title.toLowerCase().indexOf(lowerCasedInputText) > -1) {
        matchList.push(movie.title);
      }
    }
  });

  console.log(matchList);
  //   displayMatches(matchList);
  return matchList; // array of matches
} // end of getMatches

// populate autocomplete results, accepts matchList array as an argument
function displayMatches(matchList) {
  matchList.forEach(match => {
    const liElement = document.createElement("li");
    liElement.classList.add("result");
    const ulElement = document.querySelector("[data-searchButton]");
    // console.log(`in displayMatches, matchList: ${matchList}`);
    // console.log(matchList);
    liElement.textContent = match;
    // console.log(liElement);
    ulElement.appendChild(liElement);
    toggleResults("show");
  });
}

function posterClick(event) {
  console.log(event.target.data);
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

    targetInput.addEventListener("keyup", function(event) {
      console.log(results);
      results.innerHTML = "";
      toggleResults("hide");
      // `this` refers to the `targetInput`
      if (this.value.length > 0) {
        // if we typed something
        console.log("inside the if inside addEventListener");
        // console.log(event);
        console.log(event.srcElement.value); // input value
        matches = getMatches(event.srcElement.value);
        if (matches.length > 0) {
          displayMatches(matches);
        }

        // if (matches.length > 0) {
        //   displayMatches(matches);
        // }
      }
      //   getMatches(trendingList);
    }); // ends addEventListener
  });
