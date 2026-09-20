import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function App() {
  const [movies, setMovies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error("Error fetching movies", err))
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm) return

    setLoading(true)
    setError('')
    setRecommendations([])

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/recommend?title=${encodeURIComponent(searchTerm)}`
      )
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setRecommendations(data)
      }
    } catch (err) {
      setError("Failed to connect to the backend.")
      console.log(err)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold text-center mb-2">🎬 Movie Recommender</h1>
      <p className="text-center text-gray-500 mb-8">
        Type a movie you like and we'll find similar ones!
      </p>

      <form onSubmit={handleSearch} className="flex gap-2 justify-center mb-8">
        <input
          type="text"
          list="movie-list"
          placeholder="e.g., Toy Story (1995)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <datalist id="movie-list">
          {movies.map((title, idx) => (
            <option key={idx} value={title} />
          ))}
        </datalist>

        <Button type="submit">Search</Button>
      </form>

      {loading && (
        <p className="text-center text-blue-500">Finding recommendations...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((movie, idx) => (
          <Card key={idx} className="overflow-hidden">
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-72 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                No poster available
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{movie.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{movie.genres}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default App