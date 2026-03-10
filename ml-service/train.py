import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

# Load dataset
df = pd.read_csv("dataset/GlobalTemperatures.csv")

# Convert date
df['dt'] = pd.to_datetime(df['dt'], format='mixed', dayfirst=True, errors='coerce')
df = df.dropna(subset=['dt'])

# Select columns
df = df[['dt','LandAverageTemperature']]
df = df.dropna()

# Sort by date
df = df.sort_values('dt')

# Create lag features
df['lag1'] = df['LandAverageTemperature'].shift(1)
df['lag2'] = df['LandAverageTemperature'].shift(2)
df['lag3'] = df['LandAverageTemperature'].shift(3)

# Rolling mean
df['rolling_mean'] = df['LandAverageTemperature'].rolling(3).mean()

# Month feature
df['month'] = df['dt'].dt.month

# Remove NaN rows
df = df.dropna()

# Features
X = df[['lag1','lag2','lag3','rolling_mean','month']]

# Target
y = df['LandAverageTemperature']

# Train test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, shuffle=False
)

# Train model
model = RandomForestRegressor(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
pred = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, pred))
print("R2:", r2_score(y_test, pred))

# Save model
joblib.dump(model, "model/model.pkl")

print("Model saved successfully!")