const key = "api_key=d7a84f99a4028ecfd64fb27279dcfbf3";
const url = "https://api.themoviedb.org/3";
const apiURL = url + "/discover/movie?sort_by=popularity.desc&"+ key;
const img = "https://image.tmdb.org/t/p/w500";
const searchURL = url + '/search/movie?' + key;

const genres = [
  {"id":28,"name":"Ação"},
  {"id":12,"name":"Aventura"},
  {"id":16,"name":"Animação"},
  {"id":35,"name":"Comédia"},
  {"id":80,"name":"Crime"},
  {"id":99,"name":"Documentário"},
  {"id":18,"name":"Drama"},
  {"id":10751,"name":"Família"},
  {"id":14,"name":"Fantasia"},
  {"id":36,"name":"História"},
  {"id":27,"name":"Horror"},
  {"id":10402,"name":"Musical"},
  {"id":9648,"name":"Mistério"},
  {"id":10749,"name":"Romance"},
  {"id":878,"name":"SCI-FI"},
  {"id":10770,"name":"Filmes para TV"},
  {"id":53,"name":"Suspense"},
  {"id":10752,"name":"Guerra"},
  {"id":37,"name":"Faroeste"}
];

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

var selectedGenre = [];
setGenre();
function setGenre(){
  tagsEl.innerHTML = '';
  genres.forEach(genre => {
    const t = document.createElement('div');
    t.classList.add('tag');
    t.id=genre.id;
    t.innerText = genre.name;
    t.addEventListener('click', () =>{
      if(selectedGenre.length == 0){
        selectedGenre.push(genre.id)
      }else{
        if(selectedGenre.includes(genre.id)){
          selectedGenre.forEach((id, idx) => {
            if(id == genre.id){
              selectedGenre.splice(idx, 1);
            }
          })
        }else{
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre)
      getMovies(apiURL + '&with_genres='+encodeURI(selectedGenre.join(',')))
      highlightSelection()
    })
    tagsEl.append(t);
  })
}

function highlightSelection() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
      tag.classList.remove('highlight')
  })
  clearBtn()
  if(selectedGenre.length !=0){   
    selectedGenre.forEach(id => {
      const hightlightedTag = document.getElementById(id);
      hightlightedTag.classList.add('highlight');
    })
  }
}

function clearBtn(){
let clearBtn = document.getElementById('clear');
if(clearBtn){
  clearBtn.classList.add('highlight')
}else{
  let clear = document.createElement('div');
  clear.classList.add('tag', 'highlight');
  clear.id = 'clear';
  clear.innerText = 'Limpar Tudo';
  clear.addEventListener('click', () => {
    selectedGenre = [];
    setGenre();
    getMovies(apiURL);
  })
  tagsEl.append(clear);
}
}

getMovies(apiURL);


function getMovies(url){
    lastUrl = url;
    const languageParam = 'language=pt-BR';
    if (!url.includes(languageParam)) {
        url += '&' + languageParam;
    }
  fetch(url).then(res => res.json()).then(data => {
    console.log()
    if(data.results.length !== 0){
      showMovies(data.results);
    }else{
      main.innerHTML = `<h1 class="no-results">Sem Resultados</h1>`
    }
  })
}


function showMovies(data){
  main.innerHTML = '';

  data.forEach(movie =>{
    const {title, poster_path, vote_average, overview, id} = movie;
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
      <img src="${poster_path? img+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

      <div class="movie-info">
        <h3>${title}</h3>
      </div>

      <div class="overview">
        <h3>Visão Geral</h3>
        ${overview}
        <br/> 
        <button class="know-more" id="${id}">Ver mais</button
      </div>
    `   
    
    main.appendChild(movieEl);
  })
}

function getColor(vote){
  if(vote >= 8){
    return "green"
  }else if(vote >= 5){
    return "orange"
  }else{
    return "red"
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  selectedGenre = [];
  highlightSelection();
  if(searchTerm){
    getMovies(searchURL+'&query='+searchTerm)
  }else{
    getMovies(apiURL);
  }
})
