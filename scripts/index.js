
function main() {
    const listArea = document.querySelector("[data-list]");
    const modalInfo = document.querySelector("[data-modalContent]");
    const results = document.querySelector("[data-autocomplete-results]");

    let resultArray = [];
    let resultObjects = [];
    let page = 1;
    let filterChoice = "https://api.themoviedb.org/3/movie/now_playing?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e&language=en-US&page=";


    function addEventListeners(){
        const filterButton = document.querySelector("[data-filter]");
        const settingExitButton = document.querySelector("[data-settingModalClose]");
        const modalExitButton = document.querySelector("[data-modalClose]");
        const targetInput = document.querySelector("[data-searchBar]");
        const dropCategory = document.querySelectorAll("[data-category-button]")
        const videoFrame = document.querySelector("[data-videoFrame]");
        const dropdown = document.querySelector("[data-dropbutton]")
        const iframe = document.querySelector('[data-iframe]');
        const genreCheckBoxes = document.querySelectorAll("[data-genreCheckBox]");



        iframe.setAttribute('class', 'iframeVideo');
        videoFrame.appendChild(iframe);

        modalExitButton.addEventListener("click", closeModal);
        settingExitButton.addEventListener("click", closeSetting);
        filterButton.addEventListener("click", openFilterModal);
        dropdown.addEventListener("click", dropdownToggle)
        targetInput.addEventListener("focusout", closeSearch);
        targetInput.addEventListener("keyup", search);
        targetInput.focus();

        genreCheckBoxes.forEach((eaDiv) =>{
            console.log(eaDiv)
            eaDiv.addEventListener("click", genreClick)
        })
        dropCategory.forEach((eaDiv) => {
            eaDiv.addEventListener("click", dropdownClick);
        })
        listArea.onscroll = function() {
            // infinte scrolling black magic
            if (listArea.scrollTop > ((listArea.scrollHeight - 500) - listArea.offsetHeight)){
                page++;
                addPage(page);
                setTimeout(100);
            }
        }
    }
    addEventListeners()
    
    

    function dropdownClick(event) {
        const dropdown = document.querySelector("[data-dropbutton]")
        dropdown.textContent = event.target.textContent;
        dropdownToggle();

    }

    function dropdownToggle() {
        const myDropdown = document.querySelector("[data-mydropdown]")
        myDropdown.classList.toggle("show");
    }


    // SEARCH BAR SUGGESTED RESULTS
    // displayMatches - the search bar suggestions.
    // populate autocomplete results, accepts matchList array as an argument
    function displayMatches(matchList) {

        const targetInput = document.querySelector("[data-searchBar]");
        // we create a sigle div, that will hold a div for each suggested result
        const aDiv = document.createElement("div");
        // setting a class attribute for CSS styling our auto-results div
        aDiv.setAttribute("class", "autocomplete-items");
        aDiv.setAttribute("data-autocomplete-items", "data-autocomplete-items");

        // we are checking to see if its an adult movie or
        // if the vote_count is 0
        // this just filters out some unwanted movies
        // then we display each movie title to the search-bar suggestions.
        matchList.results.forEach(match => {
            if (match.adult !== true) {
                if (match['vote_count'] > 0) {
                    const bDiv = document.createElement("div");
                    bDiv.setAttribute("class", "each-auto-complete-item");
                    bDiv.addEventListener("click", searchResultClick);
                    bDiv.textContent = match.title;
                    bDiv.data = match;
                    aDiv.appendChild(bDiv);
                    resultArray.push(bDiv);
                    resultObjects.push(match);
                    fetch(`https://api.themoviedb.org/3/movie/${match.id}/videos?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e&language=en-US`)
                        .then((response) => {
                            return response.json()
                        })
                        .then((data) => {
                            bDiv.video = data;
                        });
                };
            };
            // targetInput.appendChild(aDiv);
            // results.appendChild(liElement);
        });

        targetInput.parentNode.appendChild(aDiv);
        createElements(resultObjects);

        // moveCursor(resultCursor);
    };


    // FILTER MODAL CLICK
    // 
    function openFilterModal() {
        const settingModal = document.querySelector("[data-settingModal]");
        settingModal.style.display = "flex";

    }






    // SEARCH SUGGESTION CLICK
    // when a result in the search suggestions gets clicked -
    function searchResultClick(event) {
        // first we delete all the suggested searches
        console.log("yes")
        resultArray.forEach((div) => {
            div.remove();
        });
        // then we pass the event to the posterClick function
        // which will open our modal.
        posterClick(event);

    }

    // moves cursor in the results list
    // function moveCursor(pos) {
    //     console.log(pos) // pos = 0
    //     const matchesList3 = document.querySelector("[data-autocomplete-items]")
    //     // matchesList3[0].setAttribute("class", "highlighted")
    //     // console.log(matchList)
    //     // console.log(matchesList)
    //     console.log(matchesList3)
    //     console.log(matchesList3.firstChild)
    //     const firstHighlightedDiv = matchesList3.firstChild.classList.add("highlighted");
    //     console.log(firstHighlightedDiv)

    //     // matchesList3.firstChild.classList.remove("highlighted");
    //     // matchesList3.firstChild.classList.add("highlighted");

    function addPage(page){
        start(filterChoice + page)
    }

    function startInitialPage(){
        addPage(page);
    }
    
    
    // SEARCH BAR FOCUS OUT
    // If the user focuses outside of the search-bar
    // delete the search-suggestions.
    function closeSearch() {
        function deleteAll() {
            resultArray.forEach((div) => {
                div.remove();
            });
        }
        setTimeout(deleteAll, 200);
    };
    
    
    
    // EXIT MODAL
    // when the exit button gets clicked, we hide the modal via styles.
    function closeModal() {
        const modal = document.querySelector("[data-modal]");
        const iframe = document.querySelector('[data-iframe]');
        modal.style.display = "none";
        // we delete the iframe '.src' to prevent the next modal from showing
        // the previous video.
        iframe.src = ``;
    };
    
    function closeSetting() {
        const dropdown = document.querySelector("[data-dropbutton]")
        const settingModal = document.querySelector("[data-settingModal]");
        const filterArray = [
            { "In Theaters": "https://api.themoviedb.org/3/movie/now_playing?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e&language=en-US&page=" },
            
            { "Upcoming": "https://api.themoviedb.org/3/movie/upcoming?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e&language=en-US&page=" },
            
            { "Most Popular": "https://api.themoviedb.org/3/movie/popular?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e&language=en-US&page=" },
            
            { "Top Rated": "https://api.themoviedb.org/3/movie/top_rated?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e&language=en-US&page=" }
        ]
        settingModal.style.display = "none";
        filterArray.forEach((obj) => {
            if (Object.keys(obj)[0] === dropdown.textContent) {
                filterChoice = obj[Object.keys(obj)[0]];
            }
        })
        const clickedGenres = getClickedGenres()
        // createQueryURL(clickedGenres)
        
        results.innerHTML = "";
        resultObjects = [];
        listArea.innerHTML = "";
        page = 1;
        // send filterChoice + clicked genres
        addPage(page);
    };
    
    
    function getClickedGenres() {
        const clickedGenres = []; // array of clicked genres
        const genreList = document.getElementsByName("genre");
        genreList.forEach((genre) => {
            if (genre.checked) {
                clickedGenres.push(genre.value)
            }
        })
        return clickedGenres
    }

    function genreClick(event){
        myResult = true;
        if (event.target.children[0].checked){
            myResult = false;
        }
        event.target.children[0].checked = myResult;

    }
    
    
    
    // POSTER CLICK
    // if you click on a poster, we show the modal while changing the trailer.
    function posterClick(event) {
        const modal = document.querySelector("[data-modal]");
        const iframe = document.querySelector('[data-iframe]');
        let youtubeURL = event.target.video.results[0].key;
        modal.style.display = "block";
        iframe.src = `https://www.youtube.com/embed/${youtubeURL}`;
        
    };
    
    
    // POSTER IMAGE CREATOR
    // createIMGelement creates a single poster image from a movie object.
    function createIMGelement(obj) {
        
        const imgURL = "https://image.tmdb.org/t/p/w200";
        
        // each image is inside its own div, for styling as a 'poster-frame'.
        // each poster-frame div is inside a single div 'listArea'.
        const aDiv = document.createElement("div");
        const myImg = document.createElement("img");
        aDiv.appendChild(myImg);
        listArea.appendChild(aDiv);
        
        // we set some attributes for styling in CSS
        // and the src image of each poster from the movie object.
        myImg.setAttribute("src", `${imgURL}${obj.poster_path}`);
        aDiv.setAttribute("class", "poster-frame");
        myImg.setAttribute("class", "poster-image");
        
        // we give each image a '.data' attribute with a value of its own movie object.
        // this allows us to hide that data, and 
        // refrence it later when its clicked with - event.target.data
        myImg.data = obj;
        
        // we make each image clickable.
        myImg.addEventListener("click", posterClick);
        
        // for each image we fetch the youtube trailer video data
        // then we give each image a '.video' attribute with a value of its youtube trailer data.
        // this allows us to hide that data, and
        // refrence it later when its clicked with - event.target.video
        fetch(`https://api.themoviedb.org/3/movie/${obj.id}/videos?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e&language=en-US`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            myImg.video = data;
        });


    };
    
    
    // FOR ONE FOR MANY
    // this takes a list of movie objects, and feeds them to createIMGelement.
    function createElements(myArray) {
        myArray.forEach(movieObj => {
            createIMGelement(movieObj);
        });
        setTimeout(checkPage,50);
        function checkPage(){
            console.log(listArea.scrollTop)
            console.log((Number(listArea.scrollHeight) - Number(listArea.clientHeight)))
            if(Number(listArea.scrollTop) === 0){
                if ((Number(listArea.scrollHeight) - Number(listArea.clientHeight)) === 0){
                    page++;
                    addPage(page);
                    setTimeout(100);
                }
            };
        }
    };

    // SEARCH BAR EVENT
    // our targetInput (the search bar) has a event listener for any key-up.
    // this is what we want to do everytime a key is pressed in our targetInput
    function search(event) {
        
        // key-code 13 is 'ENTER'
        // if it is NOT 13 -
        if (event.keyCode !== 13) {
            
            // we take the value of the search bar as our 'searchInput'
            const searchInput = event.srcElement.value;
            
            // we clear/delete our previously displayed movies and results.
            results.innerHTML = "";
            resultObjects = [];
            listArea.innerHTML = "";
            page = 1;
            // this will delete all of our search-bar suggestions,
            // so we can repopulate the search-bar suggestions with
            // the new 'searchInput'
            if (resultArray.length > 0) {
                resultArray.forEach((div) => {
                    div.remove();
                });
            }
            
            
            if (searchInput.length > 0) {
                let matches = fetch(`https://api.themoviedb.org/3/search/movie?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e&language=en-US&query=${searchInput}&page=1&include_adult=false`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.results.length > 0) {
                        displayMatches(data);
                    }
                })
            }
        } else if (event.keyCode == 13) { // enter
            event.srcElement.value = '';
            }
            if (event.srcElement.value.length <= 0) {
                resultArray.forEach((div) => {
                    div.remove();
                });
            }
        };
        
        function start(choice) {
            fetch(choice)
            .then(response => {
                return response.json();
            })
            .then(data => {

                trendingList = data.results
                trendingList = trendingList.filter(movie => movie.title)
                // insert filter here

                let clickedGenres = getClickedGenres();
                // console.log(clickedGenres)
                let clickedGenresIntegers = []; // array of integers
                clickedGenres.forEach(genreIDstring => {
                    clickedGenresIntegers.push(parseInt(genreIDstring, 10)) //converts the array of strings to an array of ints
                })
                if (clickedGenres.length > 0) {
                    let filteredTrendingList = [];

                    trendingList.forEach((movie) => {
                        let filteredMovie = movie.genre_ids.filter((e) => clickedGenresIntegers.indexOf(e) !== -1)
                        if (filteredMovie.length > 0) {
                            filteredTrendingList.push(movie)
                        }
                    })

                    trendingList = filteredTrendingList;
                }
                
                createElements(trendingList);
            });
        };
        startInitialPage()
    };
    
    main();