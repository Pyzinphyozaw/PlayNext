from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
import os
import requests
from dotenv import load_dotenv

# --- NEW: Load API key from .env ---
load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load model ---
print("Loading model...")
with open("model.pkl", "rb") as f:
    data = pickle.load(f)

item_sim_df = data["item_sim"]
movies = data["movies"]
print("Model loaded successfully!")

# --- NEW: Load links.csv (maps movieId -> tmdbId) ---
links = pd.read_csv("../data/ml-latest-small/links.csv")
# Drop rows with no tmdbId, convert to int
links = links.dropna(subset=["tmdbId"])
links["tmdbId"] = links["tmdbId"].astype(int)
print("Links loaded:", links.shape)

# --- NEW: Poster cache so we don't hit TMDB twice for the same movie ---
poster_cache = {}

def get_poster_url(movie_id):
    """Look up TMDB poster for a MovieLens movieId. Returns URL or None."""
    if movie_id in poster_cache:
        return poster_cache[movie_id]

    # Find tmdbId
    row = links[links["movieId"] == movie_id]
    if row.empty:
        poster_cache[movie_id] = None
        return None

    tmdb_id = int(row.iloc[0]["tmdbId"])

    try:
        url = f"https://api.themoviedb.org/3/movie/{tmdb_id}"
        res = requests.get(url, params={"api_key": TMDB_API_KEY}, timeout=5)
        if res.status_code != 200:
            poster_cache[movie_id] = None
            return None

        poster_path = res.json().get("poster_path")
        if not poster_path:
            poster_cache[movie_id] = None
            return None

        full_url = f"{TMDB_IMG_BASE}{poster_path}"
        poster_cache[movie_id] = full_url
        return full_url
    except Exception as e:
        print(f"TMDB error for {movie_id}: {e}")
        poster_cache[movie_id] = None
        return None


@app.get("/movies")
def get_all_movies():
    return movies["title"].tolist()


@app.get("/recommend")
def get_recommendations(title: str, n: int = 10):
    match = movies[movies["title"].str.lower() == title.lower()]
    if match.empty:
        return {"error": "Movie not found"}

    movie_id = match.iloc[0]["movieId"]

    sim_scores = item_sim_df[movie_id].sort_values(ascending=False)
    sim_scores = sim_scores.drop(movie_id).head(n)

    recs = movies[movies["movieId"].isin(sim_scores.index)][["movieId", "title", "genres"]]

    # --- NEW: Attach poster URLs ---
    result = []
    for _, row in recs.iterrows():
        result.append({
            "movieId": int(row["movieId"]),
            "title": row["title"],
            "genres": row["genres"],
            "poster": get_poster_url(int(row["movieId"]))
        })

    return result