import pandas as pd

# Load your full dataset
df = pd.read_csv("tmdb_movies_2024.csv")

# Optional: Preview unique values to verify the column
print("Unique values in 'adult':", df['adult'].unique())

# Filter out adult content
df_cleaned = df[df['adult'] == False]  # Or df[df['adult'] != True]

# Drop the 'adult' column if no longer needed
df_cleaned.drop(columns=['adult'], inplace=True)

# Drop unnecessary columns that are not needed for analysis
columns_to_drop = ['status', 'revenue', 'runtime', 'budget', 'original_language', 'tagline', 
                   'production_companies', 'production_countries', 'spoken_languages']
df_cleaned.drop(columns=columns_to_drop, inplace=True)

# Save the cleaned data
df_cleaned.to_csv("tmdb_movies_cleaned.csv", index=False)

print("Cleaned dataset saved to 'tmdb_movies_cleaned.csv'")
