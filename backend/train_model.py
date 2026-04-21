import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import os

def train_new_model():
    # 1. Load the data
    dataset_path = 'dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Error: {dataset_path} not found. Please create it first.")
        return

    print("Loading dataset...")
    df = pd.read_csv(dataset_path)

    # 2. Features and Target
    # We use height_m to predict age_days
    X = df[['height_m']] 
    y = df['age_days']

    # 3. Split data (optional but good practice)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 4. Initialize and Train Model
    # Random Forest is powerful and handles non-linear growth better
    print("Training Random Forest model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # 5. Evaluate
    predictions = model.predict(X_test)
    error = mean_absolute_error(y_test, predictions)
    print(f"Model Training Complete. Mean Absolute Error: {error:.2f} days")

    # 6. Save the model
    # We save it as the official name so the app picks it up immediately
    model_output = 'plant_age_model.pkl'
    joblib.dump(model, model_output)
    print(f"SUCCESS: Model saved as {model_output}")

if __name__ == "__main__":
    train_new_model()
