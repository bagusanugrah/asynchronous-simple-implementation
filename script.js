const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', function(){
    getInput();
});

// event binding
document.addEventListener('click', async function(element){
    if(element.target.classList.contains('modal-detail-button')){// element.target maksudnya element yang diklik
        try{
            const imdbid = element.target.dataset.imdbid;
            const movieDetail = await getMovieDetail(imdbid);
            if(typeof movieDetail.Title === 'undefined'){
                throw new Error('Failed to get the movie detail');
            }
            updateModal(movieDetail);
        } catch(error){
            console.log(error.message);
            const modalBody = document.querySelector('.modal-body');
            modalBody.innerHTML = `<p class="text-center"><strong>Oops! Something went wrong.</strong></p>`;
        }
    }
})

function enterKeyPressed(event){
    if(event.keyCode === 13){
        getInput();
    }
}

async function getInput(){
    try{
        const inputKeyword = document.querySelector('.input-keyword');
        const movies = await getMovies(inputKeyword.value.replace(/\s/g, '%20'));
        // karena fetch asynchronous jadi harus ditunggu sampai callback (resolve/reject) dijalankan pakai await
        updateUI(movies);// setelah callback (resolve/reject) dijalankan baru fungsi updateUI dijalankan
        /**
         * Jika getMovies() tidak pakai await maka proses getMovies() dilewat
         * kemudian langsung menjalankan updateUI() sehingga argumen movies yang masuk
         * ke fungsi updateUI bentuknya masih promise
         */
    } catch(error){
        console.log(error.message);
        const moviesContainer = document.querySelector('.movies-container');
        moviesContainer.innerHTML = `<h3 class="text-center">Oops! Something went wrong.</h3>`;
    }
}

function getMovieDetail(id){
    return fetch('https://www.omdbapi.com/?apikey=7f45229a&i=' + id)
    .then(response => response.json())
    .then(movie => movie);
}

function updateModal(movie){
    const movieDetail = showMovieDetail(movie);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = movieDetail;
}

function getMovies(keyword){
    return fetch('https://www.omdbapi.com/?apikey=7f45229a&s=' + keyword)
            .then(response => response.json())
            .then(response => response.Search);
}

function updateUI(movies){
    let cards = '';
    movies.forEach(movie => cards += showCards(movie));
    const moviesContainer = document.querySelector('.movies-container');
    moviesContainer.innerHTML = cards;
}

function showCards(movie){
    return `<div class="col-xl-3 col-lg-4 col-md-6 my-3">
                <div class="card">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'img/no-img.png'}" onerror="this.onerror=null;this.src='img/no-img.png';" class="card-img-top"  alt="${movie.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${movie.Year}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" 
                        data-bs-target="#movieDetailModal" data-imdbid="${movie.imdbID}">Show Detail</a>
                    </div>
                </div>
            </div>`;
}

function showMovieDetail(movie){
    return `<div class="container-fluid">
                <div class="row">
                    <div class="col-lg-4 d-flex justify-content-center">
                        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'img/no-img.png'}" onerror="this.onerror=null;this.src='img/no-img.png';" alt="${movie.Title}" class="img-fluid">
                    </div>
                    <div class="col-md mt-3">
                        <ul class="list-group">
                            <li class="list-group-item"><h4>${movie.Title} (${movie.Year})</h4></li>
                            <li class="list-group-item"><strong>Genre: </strong> ${movie.Genre}</li>
                            <li class="list-group-item"><strong>IMDb Rating: </strong> ${movie.imdbRating}</li>
                            <li class="list-group-item"><strong>Actors: </strong><br> ${movie.Actors}</li>
                            <li class="list-group-item"><strong>Plot: </strong><br> ${movie.Plot}</li>
                        </ul>
                    </div>
                </div>
            </div>`;
}