# 🎬 Movie Recommendation System

A full-stack movie recommendation system built using **Item-Based Collaborative Filtering** on the MovieLens dataset. The project mines ~100,000 user ratings to suggest movies similar to a given title, and serves them through a **FastAPI** backend and a **React** frontend.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Dataset](#-dataset)
- [Methodology](#-methodology)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Pipeline](#-pipeline)
- [Evaluation](#-evaluation)
- [Results](#-results)
- [Limitations](#-limitations)
- [Future Work](#-future-work)
- [Author](#-author)

---

## 🧭 Overview

With thousands of movies available across streaming platforms, users often struggle to find something worth watching. This project builds a recommendation engine that suggests movies similar to one the user already likes, based purely on historical rating data.

The system uses **Item-Based Collaborative Filtering** — the idea that *"if two movies were rated similarly by the same users, they are similar."* Similarity is measured using **Cosine Similarity** between movie rating vectors.

---

## ❓ Problem Statement

> Given a movie title, recommend the Top-N most similar movies using only historical user ratings, and serve these recommendations through a modern full-stack application.

---

## 📊 Dataset

**Source:** [MovieLens `ml-latest-small`](https://grouplens.org/datasets/movielens/) — GroupLens Research, University of Minnesota

| Attribute | Value |
|-----------|-------|
| Ratings | ~100,000 |
| Users | ~610 |
| Movies | ~9,700 |
| Rating Scale | 0.5 – 5.0 |
| Sparsity | ~98% |

**Files used:**

- `ratings.csv` → `userId`, `movieId`, `rating`, `timestamp`
- `movies.csv` → `movieId`, `title`, `genres`

**Why this dataset?**

- Free, clean, and has no missing values
- Standard benchmark in recommender systems research
- Small enough to run on a laptop, large enough to be realistic

---

## 🧠 Methodology

### Chosen Approach: **Item-Based Collaborative Filtering (IBCF)**

**Why Item-Based instead of User-Based?**

| Reason | Explanation |
|--------|-------------|
| More stable | Movie tastes change slower than user tastes |
| Scalable | Fewer items than users in most systems |
| Explainable | "Because you liked X, here is Y" is intuitive |
| Better with sparse data | Item similarities are more reliable than user similarities |

### Core Idea

> Two movies are similar if the same users rated them similarly.

### Mathematical Technique: Cosine Similarity
similarity(A, B) = (A · B) / (||A|| × ||B||)

text

- Ranges from **0** (not similar) to **1** (identical)
- Computed for **every pair of movies** → a ~9,700 × 9,700 similarity matrix

### Recommendation Logic

1. User inputs a movie title
2. Find its `movieId` in the dataset
3. Look up its row in the similarity matrix
4. Sort other movies by similarity score (descending)
5. Drop the movie itself
6. Return the **Top-N** most similar movies with their genres

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Data Processing | Python, Pandas, NumPy | Load, clean, pivot data |
| ML / Mining | Scikit-learn (`cosine_similarity`) | Compute similarity matrix |
| Model Storage | Pickle (`.pkl`) | Cache the matrix for fast loading |
| Visualization | Matplotlib | Rating distribution charts |
| Backend API | FastAPI (or Flask) | Serve recommendations as JSON |
| Frontend | React (Vite) | Search bar + movie cards UI |
| Dev Environment | VS Code, Jupyter Notebook | Build and test |

---

## 📁 Project Structure
movie-recommender/
├── data/
│ └── ml-latest-small/
│ ├── ratings.csv
│ ├── movies.csv
│ ├── links.csv
│ └── tags.csv
├── notebooks/
│ └── explore.ipynb # Data exploration + model building
├── backend/
│ ├── build_model.py # Trains + saves pickle
│ ├── app.py # FastAPI server
│ └── model.pkl # Saved similarity matrix
├── frontend/ # React (Vite) app
│ ├── src/
│ └── package.json
└── README.md

text

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/movie-recommender.git
cd movie-recommender
2. Download the dataset
Download ml-latest-small.zip from GroupLens and extract it into data/.

3. Install Python dependencies
bash
pip install pandas numpy scikit-learn matplotlib fastapi uvicorn flask flask-cors
4. Install frontend dependencies
bash
cd frontend
npm install
🚀 Usage
Build the model (once)
bash
cd backend
python build_model.py
This creates model.pkl containing the similarity matrix and movie metadata.

Start the backend
bash
uvicorn app:app --reload --port 5000
API endpoints:

GET /movies → list of all movie titles

GET /recommend?title=Toy%20Story%20(1995) → Top-N recommendations

Start the frontend
bash
cd frontend
npm run dev
Open http://localhost:3000 in your browser.

Test the recommender directly (notebook)
python
recommend("Toy Story (1995)")
recommend("Matrix, The (1999)")
🔄 Pipeline
text
[1] Download MovieLens dataset
        ↓
[2] Load ratings.csv + movies.csv (Pandas)
        ↓
[3] Explore: shape, unique users, rating distribution, sparsity
        ↓
[4] Pivot → User × Movie matrix (fill NaN with 0)
        ↓
[5] Transpose → Movie × User matrix
        ↓
[6] Compute Cosine Similarity → Movie × Movie matrix
        ↓
[7] Save model as model.pkl
        ↓
[8] FastAPI backend loads .pkl and exposes /recommend
        ↓
[9] React frontend calls API and displays Top-N movies
        ↓
[10] Demo: user types "Toy Story (1995)" → gets recommendations
📈 Evaluation
Qualitative Evaluation
Input: Toy Story (1995) → Output: A Bug's Life, Aladdin, Lion King ✅

Input: Matrix, The (1999) → Output: Terminator, Star Wars, Inception ✅

Genre overlap confirms the model learned meaningful patterns

Quantitative Metrics (future work)
RMSE — Root Mean Squared Error on held-out ratings

Precision@K / Recall@K — how many of the Top-K recommendations were relevant

✅ Results
Built a working recommendation engine using collaborative filtering

Handled ~98% sparse data effectively

Model produces genre-consistent recommendations

Deployed as a full-stack app (Python API + React UI)

⚠️ Limitations
Cold start problem: Cannot recommend for new users or new movies with no ratings

Popularity bias: Popular movies tend to dominate recommendations

No personalization per user in this version — recommendations depend only on the input movie

🔮 Future Work
Hybrid approach: combine collaborative filtering + content-based (genres, plot, tags)

Add user personalization (matrix factorization, SVD, or neural embeddings)

Cache recommendations with Redis for performance

Deploy to cloud (Render / Vercel / Railway)

👤 Author
Your Name
Course: Data Mining
Institution: Your School / University

📜 License
This project uses the MovieLens dataset, which is provided by GroupLens Research under their own terms of use. The code in this repository is free to use for educational purposes.