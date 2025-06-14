# ml_analyzer.py
import sys
import json
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder

def classify(df):
    df = df.dropna()
    features = df.drop(columns=['user_personality_type'])
    labels = df['user_personality_type']

    # Encode categorical features if necessary
    for col in features.columns:
        if features[col].dtype == 'object':
            features[col] = LabelEncoder().fit_transform(features[col])

    clf = DecisionTreeClassifier()
    clf.fit(features, labels)
    score = clf.score(features, labels)

    return {
        "model": "DecisionTreeClassifier",
        "accuracy": round(score, 2)
    }

def cluster(df):
    df = df.dropna()

    # Encode everything
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = LabelEncoder().fit_transform(df[col])

    kmeans = KMeans(n_clusters=4, n_init=10)
    kmeans.fit(df)

    return {
        "model": "KMeans",
        "clusters": kmeans.labels_.tolist()
    }

def main():
    data = json.loads(sys.stdin.read())
    df = pd.DataFrame(data)

    result = {
        "classification": classify(df),
        "clustering": cluster(df)
    }

    print(json.dumps(result))

if __name__ == "__main__":
    main()


