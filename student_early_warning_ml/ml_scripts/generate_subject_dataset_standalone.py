"""
Student Early Warning System (Subject-Wise) - Standalone Synthetic Dataset Generator
Generates 600 realistic subject-level academic records in CSV format (Zero dependencies).
"""

import csv
import math
import random

def generate_subject_csv(filename="subject_academic_data.csv", n_samples=600):
    random.seed(42)
    
    headers = [
        "subject_id",
        "subject_name",
        "ia1_score",
        "ia2_score",
        "ia3_score",
        "ia_avg",
        "ia_trend_delta",
        "attendance_percentage",
        "assignments_completed",
        "assignments_total",
        "assignment_ratio_pct",
        "backlog_probability_%",
        "backlog_risk_label",
        "risk_category"
    ]

    subject_names = [
        'Data Structures & Algorithms',
        'Database Management Systems',
        'Operating Systems',
        'Computer Networks',
        'Theory of Computation',
        'Software Engineering',
        'Machine Learning Fundamentals',
        'Object Oriented Programming',
        'Discrete Mathematics',
        'Digital Logic & Design'
    ]

    rows = []
    
    for i in range(1, n_samples + 1):
        subj_id = f"SUBJ-{100 + i}"
        subj_name = subject_names[(i - 1) % len(subject_names)]
        
        # IA Scores (0 to 100)
        base_ia = random.gauss(68, 16)
        ia1 = round(max(10.0, min(100.0, base_ia + random.gauss(0, 8))), 1)
        
        # IA2 & IA3 with realistic drop or improvement
        trend = random.gauss(-2, 10)
        ia2 = round(max(5.0, min(100.0, ia1 + trend + random.gauss(0, 6))), 1)
        ia3 = round(max(5.0, min(100.0, ia2 + (trend * 0.8) + random.gauss(0, 6))), 1)
        
        ia_avg = round((ia1 + ia2 + ia3) / 3.0, 1)
        ia_trend_delta = round(ia3 - ia1, 1)
        
        # Attendance (30% to 100%)
        att = random.gauss(76, 14)
        attendance_percentage = round(max(30.0, min(100.0, att)), 1)
        
        # Assignments completed out of 10
        total_assignments = 10
        raw_comp = (attendance_percentage / 10.0) + random.gauss(0, 1.2)
        assignments_completed = max(1, min(10, int(round(raw_comp))))
        assignment_ratio_pct = round((assignments_completed / total_assignments) * 100.0, 1)
        
        # Ground-truth logit model for backlog risk
        logit = (
            - (ia_avg * 0.08)
            - (ia3 * 0.05)
            - (ia_trend_delta * 0.06)      # Sharp falling trend increases risk heavily
            - (attendance_percentage * 0.06)
            - (assignment_ratio_pct * 0.04)
            + 9.5                           # Intercept
        )
        
        prob = 1 / (1 + math.exp(-logit))
        backlog_prob_pct = round(prob * 100.0, 1)
        
        if backlog_prob_pct >= 65.0:
            risk_category = "High Risk"
            risk_label = 1
        elif backlog_prob_pct >= 35.0:
            risk_category = "Medium Risk"
            risk_label = 1
        else:
            risk_category = "Low Risk"
            risk_label = 0

        rows.append([
            subj_id,
            subj_name,
            ia1,
            ia2,
            ia3,
            ia_avg,
            ia_trend_delta,
            attendance_percentage,
            assignments_completed,
            total_assignments,
            assignment_ratio_pct,
            backlog_prob_pct,
            risk_label,
            risk_category
        ])

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
        
    print(f"[OK] Generated {n_samples} subject records in '{filename}'.")

if __name__ == "__main__":
    generate_subject_csv()
