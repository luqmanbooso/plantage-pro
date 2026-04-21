@echo off
echo ========================================
echo   Platnage Pro - AI TRAINING ENGINE
echo ========================================
echo.
echo [1/2] Loading dataset.csv and training AI...
cd backend
.\venv\Scripts\python.exe train_model.py
echo.
echo [2/2] Training Complete! 
echo Your new model is saved as plant_age_model.pkl
echo.
pause
