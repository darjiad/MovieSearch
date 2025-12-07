import React, {useEffect, useState } from 'react'
import MovieCard from './components/MovieCard'
import Search from './components/Search'
import Spinner from './components/Spinner'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}
const App = () => {
  const [searchTerm,setSearchTerm] = useState('')
  const [errorMes, setErrorMes] = useState('')
  const [movieList, setMovieList]= useState([])
  const [isLoading, setIsLoading] = useState(false)

  // This is used to not search the query every time user type in input to avoid rate limiting.
  // It will search after every 500 ms whenever user search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [trendingMovies, setTrendingMovies] = useState([])

  useDebounce(()=>{
    setDebouncedSearchTerm(searchTerm)}, 500,[searchTerm])

  const fetchMovies = async ( query = '') =>{
    setIsLoading(true)
    setErrorMes('')
    try{
      const endpoint = query ?
      `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const resp = await fetch(endpoint,API_OPTIONS)
      if(!resp.ok){
        throw new Error('Failed to fetch movies')
      }

      const data = await resp.json()
      if(data.Response == 'False'){
        setErrorMes(data.Error || 'Failed to fetch movies')
        setMovieList([])
        return;
      }

      setMovieList(data.results || [])

      if(query && data.results.length >0){
        await updateSearchCount(query, data.results[0])
      }

    }catch(error){
      console.error(`Error fetching movies: ${error}`)
      setErrorMes(`Error fetching movies: ${error}`)
    }finally{
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async ()=>{
    try{
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    }catch(error){
      console.log(`Error Fetching Trending movies: ${error}`)
    }
  }
  useEffect(()=>{
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm])


  // Show Trending movies only at first refresh 
  // not every time when user search for the movie so that's why we created another useEffect
  useEffect(()=>{
    loadTrendingMovies()
  },[])

  return (
    <main>
    <div className='pattern'>
     
    </div>
    <div className='wrapper'>
    <header>
    <img src={'./hero-img.png'} alt="Hero Banner" />
    <h1>Find <span className='text-gradient'>Movies</span>You'll Enjoy Without the Hassle</h1>
    <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm}/>
    </header>

    { trendingMovies.length > 0 && (
      <section className='trending'>
        <h2>Trending Movies</h2>
        <ul>
          {trendingMovies.map((movie, index) => (
            <li key = {movie.$id}>
              <p>{index+1}</p>
              <img src = {movie.poster_url} alt = {movie.title}/>
            </li>
          ))}
        </ul>
      </section>
    )}
    <section className='all-movies'>
      <h2 className='mt-[40px]'>All Movies</h2>
      
      {isLoading ? (
        <Spinner/>
      ): errorMes ? (
        <p className='text-red-500'>{errorMes}</p>)
        : (
          <ul>
            {
              movieList.map((movie) =>{
                return(
                 <MovieCard key={movie.id} movie={movie}/>
                )
              })
            }
          </ul>
        )
      }
    </section>
    </div>
    </main>
  )
}

export default App
