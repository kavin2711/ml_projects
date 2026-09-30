"""
Student Early Warning System (Subject-Wise) - Random Forest ML Training Script
Trains a Random Forest Classifier on subject performance features (IA1, IA2, IA3, attendance, assignment ratio).
"""

import os
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def train_subject_model():
    data_path = "subject_academic_data.csv"
    if not os.path.exists(data_path):
        from generate_subject_dataset_standalone import generate_subject_csv
        generate_subject_csv(data_path, 600)
        
    df = pd.read_csv(data_path)
    print(f"📊 Loaded {len(df)} subject performance records.")

    feature_cols = [
        'ia1_score',
        'ia2_score',
        'ia3_score',
        'ia_avg',
        'ia_trend_delta',
        'attendance_percentage',
        'assignment_ratio_pct'
    ]

    X = df[feature_cols]
    y = (df['backlog_probability_%'] >= 35.0).astype(int) # At risk if >= 35%

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)

    rf_model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    rf_model.fit(X_train, y_train)

    rf_preds = rf_model.predict(X_test)
    rf_probs = rf_model.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, rf_preds)
    prec = precision_score(y_test, rf_preds)
    rec = recall_score(y_test, rf_preds)
    f1 = f1_score(y_test, rf_preds)
    auc = roc_auc_score(y_test, rf_probs)

    print("🌲 SUBJECT-LEVEL RANDOM FOREST RESULTS 🌲")
    print(f"   - Accuracy:  {acc * 100:.2f}%")
    print(f"   - Precision: {prec * 100:.2f}%")
    print(f"   - Recall:    {rec * 100:.2f}%")
    print(f"   - F1-Score:  {f1 * 100:.2f}%")
    print(f"   - ROC-AUC:   {auc:.4f}")

    # Feature Importance
    importances = rf_model.feature_importances_
    feat_imp = dict(sorted(zip(feature_cols, importances.round(4)), key=lambda x: x[1], reverse=True))
    
    print("\n🎯 Feature Importances:")
    for f, imp in feat_imp.items():
        print(f"   - {f:25s}: {imp * 100:5.2f}%")

    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4),
        "feature_importances": feat_imp
    }

    with open("subject_model_metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print("\n[OK] Metrics saved to 'subject_model_metrics.json'.")

if __name__ == "__main__":
    train_subject_model()
