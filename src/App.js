// import { ok } from "assert";
import { set } from "lodash";
import { useEffect, useState } from "react";
import StarRating from "./StarRating"
import { use } from "react";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "7ce6ded4";
export default function App() {
  const [query, setQuery] = useState(" ");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading ,setIsLoading] =useState(false);
  const [error, setError]= useState("")
  const tempQuery = 'interstellar';
  const [SelectedId , setSelectedId] = useState(null);

function handleSelectMovie(id){
  setSelectedId((SelectedId)=>(id === SelectedId? null : id));
}

function handleCloseMovie(){
  setSelectedId(null)
}

function handleAddWatched(movie){
   setWatched((watched)=>[...watched, movie]);

  //  localStorage.setItem('watched', JSON.stringify([...watched, movie]));

}

function handleDeleteWatched (id) {
setWatched( watched=>watched.filter(movie=>movie.imdbID !== id))
}

  useEffect(function(){

    localStorage.setItem('watched', JSON.stringify(watched));
  },[watched])


  
  useEffect(function(){
 const controller = new AbortController();  
    async function fetchMovies() {
 try {  setIsLoading(true);
  setError("")
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
      {signal : controller.signal}
    );
    if (!res.ok) 
      throw new Error ("Somthing went wrong with fetching movies");
    const data = await res.json();
    if (data.Response === 'false') throw new Error ('Movie not Found')
    setMovies(data.Search)
  setError('')
    
  } catch(err){
      
      if(err.message !== "AbortError"){
        console.log(err.message);
        setError(err.message)
      }
     
    } finally{
      setIsLoading(false);
    }
      
    }
    if(query.length < 3){
      setMovies([]);
      setError("")
      return
    }
// this is to prevent the fetch from running when the query is empty
    handleCloseMovie();
    fetchMovies();

    return function(){
      controller.abort();
    }
   
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
            SelectedId ?(<MovieDetail 
              SelectedId={SelectedId} 
              onCloseMOvie={handleCloseMovie} 
              onAddWatched={handleAddWatched}
              watched = {watched}/> ):(
          <>
          <WatchSummary watched={watched} />
          <WatchMoviesList watched={watched}
            onDeleteWatched ={handleDeleteWatched}
           />
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
      Found <strong>{movies?.length || 0}</strong> results
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

function MovieDetail({SelectedId , onCloseMOvie, onAddWatched, watched}){

  const [movie , setMovie] = useState({});
  const [isloading ,setIsLoading] = useState(false);
  const [userRating ,setUserRating] = useState('');
  const isWatched = watched.map(movie=>movie.imdbID).includes(SelectedId)
  const watchedUserRating = watched.find( (movie)=>movie.imdbID=== SelectedId)?.userRating
  const {Title: title , Year: year , Poster: poster, RunTime : runtime , imdbRating , Plot: plot ,Released : released , Actors: actors , Director : direcrtor , Genre: genre,} = movie;


  // if (imdbRating>8) [isTop ,setIsTop]= useState(true);
  //if (imdbRating<8) return <p>greter for ever!</p>

  // const [isTop , setIsTop] = useState(imdbRating > 8);
  // console.log(isTop);

  // useEffect(function(){
  // setIsTop(imdbRating>8);

  // },[imdbRating])


const isTop = imdbRating > 8;
console.log(isTop);

// const [avgRating , setAvgRating] = useState(0);
  function handleAdd(){
  const runtimeNumber = Number(runtime?.split(" ")?.[0] || 0);
  const newWatchedMovie={
    imdbID : SelectedId,
    title,
    year,
    poster,
    imdbRating : Number(imdbRating),
    runtime: runtimeNumber,
    userRating,

  };
    onAddWatched(newWatchedMovie)
    onCloseMOvie();

    // setAvgRating(Number(imdbRating));
    // setAvgRating( avgRating=>(avgRating+userRating)/2)
 }
 useEffect(function(){

  function callback (e){

    if(e.code === 'Escape') {
      onCloseMOvie();
  }}

  document.addEventListener('keydown', callback)
   
  return function(){
  document.removeEventListener('keydown',callback)
}}
,[onCloseMOvie])


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
 

useEffect(function(){

  if(!title) return;
  document.title = `Movie | ${title}`

  return function(){
    document.title = "usePopcorn";
    // console.log(`Clean up effect for movie ${title}`);
  }
},[title])

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

   {/* <p> {avgRating}</p> */}
    <section>
      <div className="rating">
        {!isWatched ? (
        <>
      <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
      {userRating >0 &&( <button className="btn-add" onClick={handleAdd}>+ Add to List</button>)}
        </>):(
      <p>You Rated The Movie {watchedUserRating} <span>⭐</span></p>
        )}
      </div>
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
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie , onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
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
        
        <button className="btn-delete" onClick={()=>onDeleteWatched(movie.imdbID)}>
          x
        </button>
        
      </div>
    </li>
  );
}
