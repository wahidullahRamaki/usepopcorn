// import { ok } from "assert";
import { set } from "lodash";
import { useEffect, useState } from "react";
import StarRating from "./StarRating"

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "7ce6ded4";
export default function App() {
  const [query, setQuery] = useState("inception");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading ,setIsLoading] =useState(false);
  const [error, setError]= useState("")
  const tempQuery = 'interstellar';
  const [SelectedId , setSelectedId] = useState(null);


/*
  useEffect(function(){
    console.log('After intail render')
  },[])

  useEffect(function(){
    console.log('After every render')
  })

  useEffect(function(){
    console.log('d')
  },[query])
  console.log('during render')
*/


function handleSelectMovie(id){
  setSelectedId((SelectedId)=>(id === SelectedId? null : id));
}

function handleCloseMovie(){
  setSelectedId(null)
}

  useEffect(function(){
   
    async function fetchMovies() {
 try {  setIsLoading(true);
  setError("")
    const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);
    if (!res.ok) throw new Error ("Somthing went wrong with fetching movies");
    const data = await res.json();
    if (data.Response === 'false') throw new Error ('Movie not Found')
    setMovies(data.Search)
    
  } catch(err){
      console.error(err.message);
      setError(err.message)
    } finally{
      setIsLoading(false);
    }
      
    }
    if(query.length < 3){
      setMovies([]);
      setError("")
      return
    }
    fetchMovies();
   
  },[query]);

  // useEffect(function(){
  //   fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //   .then((res) =>res.json()
  //   .then((data) => setMovies(data.Search))
  //   );
  // },[])
  
  return (
    <>
      <NanBar>
        <Search  query={query} setQuery={setQuery}/>
        <NumResualt movies={movies} />
      </NanBar>
      <Main>
        <Box>
         {/* {isLoading ? <Loader /> :<MovieList movies={movies} />} */}
         {isLoading && <Loader/>}
         {!isLoading && !error && <MovieList movies={movies}  onSelectMovie={handleSelectMovie}/>}
         {error && <ErrorMessage message={error}/>}
        </Box>
        <Box>

          {
            SelectedId ?(<MovieDetail SelectedId={SelectedId} onCloseMOvie={handleCloseMovie}/> ) :(
          <>
          <WatchSummary watched={watched} />
          <WatchMoviesList watched={watched} />
        </>)}
        </Box>
      </Main>
    </>
  );
}
function Loader (){
  return <p className="loader">LOADING...</p>
}
function ErrorMessage({message}
){return(
  <p className="error"> <span>⛔</span>{message}
  </p>
)

}
function NanBar({ children }) {
  return (
    <nav className="nav-bar">
      {" "}
      <Logo />
      {children}
    </nav>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({query, setQuery}) {

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function NumResualt({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);

//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchSummary watched={watched} />
//           <WatchMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }
function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}
function Movie({ movie, SelectedId , onSelectMovie}) {
  return (
    <li onClick={()=>onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetail({SelectedId , onCloseMOvie}){

  const [movie , setMovie] = useState({});
  const [isloading ,setIsLoading] = useState(false)
   
  const {Title: title , Year: year , Poster: poster, RunTime : runtime , imdbRating , Plot: plot ,Released : released , Actors: actors , Director : direcrtor , Genre: genre,} = movie;

useEffect(function(){
async function getMovieDetail (){
  setIsLoading(true);
  const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${SelectedId}`);
  const data = await res.json()
  setMovie(data)
  setIsLoading(false)
}
getMovieDetail()

},[SelectedId])

  return <div className="details">
    {isloading ? <Loader/> :
    <>
<header>

    <button className="btn-back" onClick={onCloseMOvie}>&larr;</button>
    <img src={poster} alt={`poster of the ${movie} movie`}/>
    <div className="details-overview">
      <h2>{title}</h2>
      <p>{released} &bull; {runtime}</p>
      <p>{genre}</p>
      <p><span>⭐</span>{imdbRating}</p>
    </div>
    </header>
    <section>
      <StarRating maxRating={10} size={24}/>
      <p>
        <em>{plot}</em>
      </p>
      <p>Starring {actors}</p>
      <p>Directed by {direcrtor}</p>
    </section>
    </>
  
}
  </div>
}

function WatchSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchMoviesList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
