import pandas as pd
# Load dataset
movies_df = pd.read_csv("tmdb_movies_2024.csv")

# Convert all text to lowercase for better filtering
movies_df["title"] = movies_df["title"].astype(str).str.lower()
movies_df["genres"] = movies_df["genres"].astype(str).str.lower()
movies_df["overview"] = movies_df["overview"].astype(str).str.lower()
movies_df = movies_df[movies_df['genres'].str.strip() != '']

# List of explicit words to filter out
explicit_keywords = [
    "porn", "xxx", "erotic", "hentai", "adult", "hardcore",
    "softcore", "strip", "nsfw", "nude", "sex", "fetish", "titty",
    "creampie", "anal", "incest", "cum", "bondage", "climax" "blacked"
    "trans"
]

# Function to detect adult content
def is_explicit(movie):
    return any(word in movie["title"] for word in explicit_keywords) or any(word in movie["genres"] for word in explicit_keywords) or any(word in movie["overview"] for word in explicit_keywords)

# Remove explicit content
filtered_movies_df = movies_df[~movies_df.apply(is_explicit, axis=1)]

# Save cleaned dataset
filtered_movies_df.to_csv("tmdb_movies_cleaned.csv", index=False)
print(movies_df['genres'].isna().sum())  # Should print 0
print(movies_df[movies_df['genres'] == ''])  # Should return an empty DataFrame

print(f"Cleaned dataset saved as 'tmdb_movies_cleaned.csv' with {len(filtered_movies_df)} movies.")
