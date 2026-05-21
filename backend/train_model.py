import pandas as pd
import re
import nltk
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

nltk.download('stopwords')

# Load dataset
df = pd.read_csv('dataset/fake_reviews_dataset.csv')

# Keep required columns
df = df[['text_', 'label']]

# Rename columns
df.columns = ['review', 'label']

# Convert labels
df['label'] = df['label'].map({
    'CG': 1,
    'OR': 0
})

# Clean text
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z ]', '', text)
    return text

df['review'] = df['review'].apply(clean_text)

# Features
X = df['review']
y = df['label']

# TF-IDF
vectorizer = TfidfVectorizer(
    stop_words='english',
    max_features=5000
)

X_vec = vectorizer.fit_transform(X)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X_vec,
    y,
    test_size=0.2,
    random_state=42
)

# Model
model = LogisticRegression()

model.fit(X_train, y_train)

# Accuracy
preds = model.predict(X_test)

accuracy = accuracy_score(y_test, preds)

print(f'Accuracy: {accuracy:.2f}')

# Save model
joblib.dump(model, 'fake_review_model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')

print('Model and vectorizer saved!')