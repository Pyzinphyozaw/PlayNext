 Movie Recommendation System

A full-stack movie recommendation system built using Item-Based Collaborative Filtering on the MovieLens dataset. The project includes a Python backend (FastAPI) serving recommendations via REST API and a React frontend for user interaction.

📌 Project Overview

With thousands of movies available across streaming platforms, users often struggle to decide what to watch. This project builds a recommendation engine that suggests movies similar to one the user already likes, based purely on historical rating data.

Core idea: Two movies are similar if the same users rated them similarly.

🎯 Objectives

Build a working movie recommender using collaborative filtering. Handle sparse real-world rating data effectively. Serve recommendations through a REST API. Provide a simple, interactive React UI. Document methodology for academic evaluation.

📂 Dataset

Source: MovieLens ml-latest-small — GroupLens Research, University of Minnesota.

Files: ratings.csv (userId, movieId, rating, timestamp), movies.csv (movieId, title, genres), links.csv (movieId, imdbId, tmdbId), tags.csv (userId, movieId, tag, timestamp).

Size: approximately 100,000 ratings, 610 users, 9,700 movies.

Why this dataset: Free and publicly available. Clean, no missing values in key columns. Standard benchmark for recommender systems. Small enough to run locally, large enough to be realistic.

🧠 Methodology

Approach: Item-Based Collaborative Filtering (IBCF).

Why Item-Based instead of User-Based: More stable because movie tastes change slower than user tastes. Scalable because there are usually fewer items than users. Explainable because "Because you liked X, here is Y" is intuitive. Better with sparse data because item similarities are more reliable than user similarities.

Mathematical Technique: Cosine Similarity. similarity(A, B) = (A · B) / (||A|| × ||B||). Ranges from 0 (not similar) to 1 (identical). Computed for every pair of movies giving a ~9,700 × 9,700 matrix.

Recommendation Logic: User inputs a movie title. Find its movieId in the dataset. Look up its row in the similarity matrix. Sort other movies by similarity score descending. Drop the movie itself. Return the Top-N most similar movies with their genres.

🛠️ Tech Stack

Data Processing: Python, Pandas, NumPy. ML / Mining: Scikit-learn cosine_similarity. Model Storage: Pickle (.pkl). Visualization: Matplotlib. Backend API: FastAPI. Frontend: React (Vite). Dev Environment: VS Code, Jupyter Notebook.

🔄 Pipeline

Step 1: Download MovieLens dataset. Step 2: Load ratings.csv and movies.csv with Pandas. Step 3: Explore shape, unique users, rating distribution, sparsity. Step 4: Pivot into User × Movie matrix, fill NaN with 0. Step 5: Transpose into Movie × User matrix. Step 6: Compute Cosine Similarity into Movie × Movie matrix. Step 7: Save model as model.pkl. Step 8: FastAPI backend loads .pkl and exposes /recommend. Step 9: React frontend calls API and displays Top-N movies. Step 10: Demo with a title like Toy Story (1995) returning recommendations.

📁 Project Structure

movie-recommender/ contains data/ml-latest-small/ with ratings.csv, movies.csv, links.csv, tags.csv. notebooks/explore.ipynb for exploration and model building. backend/ with model.py, build_model.py, app.py, model.pkl. frontend/ for the React app. README.md.

🚀 Getting Started

Clone the repository: git clone <your-repo-url> then cd movie-recommender.

Install Python dependencies: pip install pandas numpy scikit-learn matplotlib fastapi uvicorn.

Download the dataset from grouplens.org and extract into data/.

Build the model: run notebooks/explore.ipynb or cd backend && python build_model.py. This generates model.pkl.

Start the backend: uvicorn app:app --reload --port 8000. API at http://localhost:8000.

Start the frontend: cd frontend && npm install && npm run dev. Frontend at http://localhost:5173.

🔌 API Endpoints

GET /movies returns list of all movie titles. GET /recommend?title=Inception (2010)&n=10 returns Top-N similar movies. Example response: a JSON array with title and genres fields.

📊 Evaluation

Qualitative: Toy Story (1995) returns A Bug's Life, Aladdin, Lion King. Matrix, The (1999) returns Terminator, Star Wars, Inception. Genre overlap confirms the model learned meaningful patterns.

Quantitative (Future Work): RMSE on held-out ratings, Precision@K and Recall@K.

✅ Results

Built a working recommendation engine using collaborative filtering. Handled 98% sparse data effectively. Produced genre-consistent recommendations. Deployed as a full-stack app.

⚠️ Limitations

Cold start problem for new users or movies with no ratings. Popularity bias toward popular movies. No personalization per user in this version.

🔮 Future Work

Hybrid approach combining collaborative filtering with content-based filtering. Add user personalization using matrix factorization or SVD. Cache recommendations with Redis. Add movie posters via TMDB API. Deploy to Render, Vercel, or Railway.

📚 References

MovieLens Dataset at grouplens.org. Scikit-learn Cosine Similarity documentation. Sarwar et al. (2001) Item-Based Collaborative Filtering Recommendation Algorithms. Linden et al. (2003) Amazon.com Recommendations: Item-to-Item Collaborative Filtering.

👤 Author

Your Name. Course: Data Mining. Institution: Your School. Year: 2025.

📄 License

This project is for educational purposes only. The MovieLens dataset is provided by GroupLens Research under their own terms of use.


