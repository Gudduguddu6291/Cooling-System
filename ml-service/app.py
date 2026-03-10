from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

model = joblib.load("model/model.pkl")

class TempInput(BaseModel):
    lag1: float
    lag2: float
    lag3: float
    rolling_mean: float
    month: int


@app.post("/predict")
def predict(data: TempInput):

    features = pd.DataFrame([{
        "lag1": data.lag1,
        "lag2": data.lag2,
        "lag3": data.lag3,
        "rolling_mean": data.rolling_mean,
        "month": data.month
    }])

    prediction = model.predict(features)

    return {
        "predicted_temperature": float(prediction[0])
    }