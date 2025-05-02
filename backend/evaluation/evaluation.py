import pandas as pd
import math

# Preprocess the dataset 
def preprocess_df(df):
    df['genres'] = df['genres'].fillna('').apply(lambda x: set(x.lower().split('|')))
    df['keywords'] = df['keywords'].fillna('').apply(lambda x: set(x.lower().split('|')))
    return df

# Jaccard similarity function for sets 
def jaccard_similarity(set1, set2):
    if not set1 or not set2:
        return 0.0
    return len(set1 & set2) / len(set1 | set2)

# Recommend top-N similar movies based on genre/keyword similarity 
def get_similar_movies(movie_id, df, top_n=10):
    # Find the target movie
    target = df[df['id'] == movie_id]
    if target.empty:
        return []

    # Extract its genres and keywords
    target_genres = target.iloc[0]['genres']
    target_keywords = target.iloc[0]['keywords']

    # Compute similarity scores with all other movies
    df['similarity'] = df.apply(
        lambda row: (
            0.5 * jaccard_similarity(row['genres'], target_genres) +
            0.5 * jaccard_similarity(row['keywords'], target_keywords)
        ), axis=1
    )

    # Return top-N most similar movies 
    similar_movies = df[df['id'] != movie_id].sort_values(by='similarity', ascending=False)
    return similar_movies['id'].tolist()[:top_n]

# Ground truth: use only genre similarity (not keywords)
def get_ground_truth(movie_id, df, top_n=10):
    target = df[df['id'] == movie_id]
    if target.empty:
        return []

    target_genres = target.iloc[0]['genres']

    df['gt_similarity'] = df.apply(
        lambda row: jaccard_similarity(row['genres'], target_genres), axis=1
    )

    similar_movies = df[df['id'] != movie_id].sort_values(by='gt_similarity', ascending=False)
    return similar_movies['id'].tolist()[:top_n]


# Precision@K: Proportion of recommended items that are relevant 
def precision_at_k(recommended, ground_truth, k=10):
    return sum(1 for r in recommended[:k] if r in ground_truth) / k if k else 0

# Recall@K: Proportion of relevant items that were recommended 
def recall_at_k(recommended, ground_truth, k=10):
    return sum(1 for r in recommended[:k] if r in ground_truth) / len(ground_truth) if ground_truth else 0

# F1@K: Harmonic mean of precision and recall 
def f1_score_at_k(precision, recall):
    return 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

# MAP@K: Average Precision across ranked list 
def average_precision(recommended, ground_truth, k=10):
    hits, score = 0, 0
    for i, rec in enumerate(recommended[:k]):
        if rec in ground_truth:
            hits += 1
            score += hits / (i + 1)
    return score / len(ground_truth) if ground_truth else 0

# MRR: Reciprocal of rank of first relevant item 
def reciprocal_rank(recommended, ground_truth):
    for i, rec in enumerate(recommended):
        if rec in ground_truth:
            return 1 / (i + 1)
    return 0

# nDCG: Normalised Discounted Cumulative Gain 
def dcg(recommended, ground_truth, k=10):
    return sum(1 / math.log2(i + 2) for i, rec in enumerate(recommended[:k]) if rec in ground_truth)

def idcg(ground_truth, k=10):
    return sum(1 / math.log2(i + 2) for i in range(min(len(ground_truth), k)))

def ndcg(recommended, ground_truth, k=10):
    ideal = idcg(ground_truth, k)
    return dcg(recommended, ground_truth, k) / ideal if ideal != 0 else 0

# Main Evaluation Function 
def evaluate(df, sample_size=50, k=10):
    # Preprocess genres and keywords
    df = preprocess_df(df)

    # Randomly select sample movies to evaluate
    sample_ids = df['id'].sample(sample_size).tolist()

    # Store metrics for each movie
    results = []

    for movie_id in sample_ids:
        # Generate ground truth and recommendations
        ground_truth = get_ground_truth(movie_id, df, top_n=k)
        recommended = get_similar_movies(movie_id, df, top_n=k)

        # Compute metrics
        precision = precision_at_k(recommended, ground_truth, k)
        recall = recall_at_k(recommended, ground_truth, k)
        f1 = f1_score_at_k(precision, recall)
        ap = average_precision(recommended, ground_truth, k)
        rr = reciprocal_rank(recommended, ground_truth)
        ndcg_score = ndcg(recommended, ground_truth, k)

        # Append to results
        results.append({
            'movie_id': movie_id,
            'precision': precision,
            'recall': recall,
            'f1': f1,
            'map': ap,
            'mrr': rr,
            'ndcg': ndcg_score
        })

    # Convert to DataFrame
    df_results = pd.DataFrame(results)

    # Compute average metrics across all movies
    summary = {
        'precision@k': df_results['precision'].mean(),
        'recall@k': df_results['recall'].mean(),
        'f1@k': df_results['f1'].mean(),
        'map@k': df_results['map'].mean(),
        'mrr': df_results['mrr'].mean(),
        'ndcg@k': df_results['ndcg'].mean()
    }

    # Return both summary and detailed per-movie results
    return {
        'metrics_summary': summary,
        'sample_results': results
    }
