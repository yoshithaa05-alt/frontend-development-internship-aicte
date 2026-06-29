const apiKey = "5fe273fcbd2d0edd0caff68c1369977f";  // Your real TMDb API key
const searchBtn = document.getElementById("search-btn");
const movieInput = document.getElementById("movie-input");
const movieContainer = document.getElementById("movie-container");

searchBtn.addEventListener("click", () => {
  const query = movieInput.value.trim();
  if (query) {
    fetchMovies(query);
  }
});

// Search movies
function fetchMovies(query) {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
    .then(response => response.json())
    .then(data => {
      movieContainer.innerHTML = "";
     // console.log("API response:", data);
      if (Array.isArray(data.results) && data.results.length > 0) { 
        data.results.forEach(movie => displayMovie(movie));
      } else {
        movieContainer.innerHTML = "<p>No movies found.</p>";
      }
    });
}

// Display each movie card
function displayMovie(movie) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
    : "https://via.placeholder.com/150";

  const movieCard = document.createElement("div");
  movieCard.className = "movie-card";

  const poster = document.createElement("img");
  poster.src = posterUrl;

  const info = document.createElement("div");
  info.className = "movie-info";

  info.innerHTML = `
    <h2>${movie.title} (${movie.release_date ? movie.release_date.split("-")[0] : "N/A"})</h2>
    <p><strong>Overview:</strong> ${movie.overview || "No description available."}</p>
    <div class="rating-box">
      <label>Rate: </label>
      <input type="number" min="1" max="10" id="rating-${movie.id}" value="${getRating(movie.id)}">
      <button onclick="saveRating('${movie.id}')">Save</button>
    </div>
    <div class="comments">
      <h4>Comments</h4>
      <div id="comments-${movie.id}">
        ${getComments(movie.id).map(c => `<div class="comment-item">${c}</div>`).join('')}
      </div>
      <input type="text" id="comment-input-${movie.id}" placeholder="Add comment">
      <button onclick="addComment('${movie.id}')">Add</button>
    </div>
  `;

  movieCard.appendChild(poster);
  movieCard.appendChild(info);
  movieContainer.appendChild(movieCard);
}

// Local Storage functions
function saveRating(movieId) {
  const rating = document.getElementById(`rating-${movieId}`).value;
  localStorage.setItem(`rating-${movieId}`, rating);
  alert("Rating saved!");
}

function getRating(movieId) {
  return localStorage.getItem(`rating-${movieId}`) || "";
}

function addComment(movieId) {
  const commentInput = document.getElementById(`comment-input-${movieId}`);
  const comment = commentInput.value.trim();
  if (comment) {
    const comments = getComments(movieId);
    comments.push(comment);
    localStorage.setItem(`comments-${movieId}`, JSON.stringify(comments));
    document.getElementById(`comments-${movieId}`).innerHTML = comments.map(c => `<div class="comment-item">${c}</div>`).join('');
    commentInput.value = "";
  }
}

function getComments(movieId) {
  return JSON.parse(localStorage.getItem(`comments-${movieId}`) || "[]");
}
