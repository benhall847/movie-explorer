
function main(){
    const listArea = document.querySelector("[data-list]");
    const modal = document.querySelector("[data-modal]");
    const modalFrame = document.querySelector("[data-modalFrame]");
    const videoFrame = document.querySelector("[data-videoFrame]");
    const targetInput = document.querySelector("[data-searchBar]");
    // const targetInput2 = document.querySelector("[data-searchBar2]");
    const modalInfo = document.querySelector("[data-modalContent]");
    const modalExitButton = document.querySelector("[data-modalClose]");
    const results = document.querySelector("[data-autocomplete-results]");
    const aDiv = document.createElement("div");
    const iframe = document.createElement('iframe');
    iframe.setAttribute('class', 'iframeVideo');
    videoFrame.appendChild(iframe);
    let currentFocus;

    const imgURL = "https://image.tmdb.org/t/p/w200";
    
    let resultArray = [];
    let resultObjects = [];
    let trendingList;

    targetInput.addEventListener("keyup", search);
    modalExitButton.addEventListener("click", closeModal);
    
    let matches = [];
    
    // focus the input
    targetInput.focus();
    

    
    // populate autocomplete results, accepts matchList array as an argument
    function displayMatches(matchList) {
        aDiv.setAttribute("class","autocomplete-items");
        matchList.results.forEach(match => {
            if (match.adult !== true){
                if (match['vote_count'] > 0){

                    const bDiv = document.createElement("div");
                    bDiv.textContent = match.title;
                    bDiv.data = match;
                    aDiv.appendChild(bDiv);
                    resultArray.push(bDiv);
                    resultObjects.push(match);
                }
            }
            // targetInput.appendChild(aDiv);
            // results.appendChild(liElement);
        });
        targetInput.parentNode.appendChild(aDiv);
        createElements(resultObjects);
    };

    function closeModal(){
        modal.style.display = "none";
        iframe.src = ``;
    };

    function posterClick(event) {
        let youtubeURL = event.target.video.results[0].key;
        modal.style.display = "block";
        iframe.src = `https://www.youtube.com/embed/${youtubeURL}`;
    };

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
    };

    function createElements(myArray) {
        myArray.forEach(movieObj => {
            createIMGelement(movieObj);
        });
    };

    function sortPopularity(a, b) {
        if (a.popularity > b.popularity) {
            return -1;
        }
        if (b.popularity > a.popularity) {
            return 1;
        }
        return 0;
    };

    function search(event) {
        if (event.keyCode !== 13){
            const searchInput = event.srcElement.value;
            results.innerHTML = "";
            resultObjects = [];
            listArea.innerHTML = "";
            if(resultArray.length > 0){
                resultArray.forEach((div)=>{
                    div.remove();
                });
            }
            if (searchInput.length > 0) {
            let matches = fetch(`https://api.themoviedb.org/3/search/movie?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e&language=en-US&query=${searchInput}&page=1&include_adult=false`)
                .then((response) =>{
                    return response.json();
                })
                .then((data) => {
                        if (data.results.length > 0) {
                            displayMatches(data);
                        }
                })
            }
        }else{
            console.log(targetInput.parentNode)
        }
    };

    function start(){
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
    }
    start();

};

main();