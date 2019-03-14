const listArea = document.querySelector('[data-list]');

const imgURL = 'https://image.tmdb.org/t/p/w200';

let trendingList;



function posterClick(event){
    console.log(event.target.data);
};


function createIMGelement(obj){
    const aDiv = document.createElement('div');
    const myImg = document.createElement('img');
    listArea.appendChild(aDiv);
    myImg.setAttribute('src', `${imgURL}${obj.poster_path}`);
    aDiv.setAttribute('class', 'poster-frame');
    myImg.setAttribute('class', 'poster-image');
    myImg.data = obj;
    aDiv.appendChild(myImg);
    myImg.addEventListener('click', posterClick);
};

function createElements(myArray){
    myArray.forEach(movieObj => {
        createIMGelement(movieObj);
    })
};

function sortPopularity(a, b) {
    if (a.popularity > b.popularity){
        return -1;
    }
    if (b.popularity > a.popularity){
        return 1;
    }
    return 0;
};

const ListSpike = fetch("https://api.themoviedb.org/3/trending/all/week?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e")
    .then(response =>{
        return response.json();
    })
    .then(data =>{
        trendingList = data.results;
        trendingList.sort(sortPopularity);
        createElements(trendingList);
});
