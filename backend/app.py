from fastapi import FastAPI
from pydantic import BaseModel
import joblib

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model
model = joblib.load('fake_review_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

# Sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Request schema
class ReviewRequest(BaseModel):
    review: str

@app.get('/')
def home():
    return {
        "message": "SmartReview AI API Running"
    }

@app.post('/predict')
def predict(data: ReviewRequest):

    text = data.review

    # Vectorize text
    vec = vectorizer.transform([text])

    # Predict
    prediction = model.predict(vec)[0]

    # Confidence score
    probability = model.predict_proba(vec)[0]
    confidence = round(max(probability) * 100, 2)

    # Sentiment analysis
    sentiment_score = analyzer.polarity_scores(text)

    compound = sentiment_score['compound']

    if compound >= 0.05:
        sentiment = "Positive"
    elif compound <= -0.05:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return {
        "prediction": "Fake Review" if prediction == 1 else "Genuine Review",
        "confidence": confidence,
        "sentiment": sentiment
    }