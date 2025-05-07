import { useEffect, useState } from "react";
const KEY = "7ce6ded4";
export function useMovies(query){
    
    const [movies, setMovies] = useState([]);
    const [isLoading ,setIsLoading] =useState(false);
    const [error, setError]= useState("")

    useEffect(function(){

        // callback?.();

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
    //    handleCloseMovie();
       fetchMovies();
   
       return function(){
         controller.abort();
       }
      
     },[query]);
   return {isLoading,movies, error}
}