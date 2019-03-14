const listArea = document.querySelector('[data-list]');

const imgURL = 'https://image.tmdb.org/t/p/w200'

let trendingList



function doStuff(obj){
    const aDiv = document.createElement('div');
    const myImg = document.createElement('img');
    listArea.appendChild(aDiv);
    myImg.setAttribute('src', `${imgURL}${obj.poster_path}`)
    aDiv.setAttribute('style', 'width: 33%')
    myImg.setAttribute('style', 'width: 98%')
    aDiv.appendChild(myImg);
};


function doLotsStuff(myArray){
    myArray.forEach(eaObj => {
        doStuff(eaObj)
    })
};



const ListSpike = fetch("https://api.themoviedb.org/3/trending/all/week?api_key=a2fe439608a4e1ab4fe40ea29bac0e9e")
    .then(response =>{
        return response.json();
    })
    .then(data =>{
        trendingList = data.results
        doLotsStuff(trendingList);
});

