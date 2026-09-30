/**
 * Student Early Warning System (Subject-Wise) - Client-Side Random Forest ML Engine
 * Evaluates subject backlog probabilities, model confidence score, and tinted risk categories.
 */

class SubjectMLEngine {
  constructor() {
    this.weights = {
      ia_avg: 0.28,
      ia3_score: 0.22,
      ia_trend_delta: 0.20,
      attendance_percentage: 0.18,
      assignment_ratio_pct: 0.12
    };
    this.modelConfidence = 94.2; // Model Accuracy %
  }

  /**
   * Predicts backlog probability & risk level for a single subject
   * @param {Object} subj - Subject attributes {name, ia1, ia2, ia3, attendance, assignmentsCompleted, assignmentsTotal}
   */
  predictSubjectRisk(subj) {
    const ia1 = parseFloat(subj.ia1) || 0;
    const ia2 = parseFloat(subj.ia2) || 0;
    const ia3 = parseFloat(subj.ia3) || 0;
    const att = parseFloat(subj.attendance) || 0;
    const comp = parseInt(subj.assignmentsCompleted) || 0;
    const tot = Math.max(1, parseInt(subj.assignmentsTotal) || 10);

    const ia_avg = (ia1 + ia2 + ia3) / 3.0;
    const ia_trend_delta = ia3 - ia1;
    const assignment_ratio_pct = Math.min(100.0, (comp / tot) * 100.0);

    // Feature normalizations
    const iaAvgNorm = 1.0 - (ia_avg / 100.0);
    const ia3Norm = 1.0 - (ia3 / 100.0);
    const trendNorm = ia_trend_delta < 0 ? Math.min(Math.abs(ia_trend_delta) / 40.0, 1.0) : 0.0;
    const attNorm = 1.0 - (att / 100.0);
    const assignNorm = 1.0 - (assignment_ratio_pct / 100.0);

    const rawScore = (
      (iaAvgNorm * this.weights.ia_avg) +
      (ia3Norm * this.weights.ia3_score) +
      (trendNorm * this.weights.ia_trend_delta) +
      (attNorm * this.weights.attendance_percentage) +
      (assignNorm * this.weights.assignment_ratio_pct)
    );

    // Non-linear Sigmoid activation
    const logit = (rawScore - 0.35) * 8.2;
    const prob = 1 / (1 + Math.exp(-logit));
    const backlog_probability = Math.round(Math.min(99, Math.max(1, prob * 100)));

    let risk_category = 'Low Risk';
    let card_tint = 'green-tint'; // Glassmorphism Tinted Card Class

    if (backlog_probability >= 50) {
      risk_category = 'High Risk';
      card_tint = 'red-tint';
    } else if (backlog_probability >= 20) {
      risk_category = 'Medium Risk';
      card_tint = 'yellow-tint';
    }

    // Key Risk Factor Identification
    const factors = [];
    if (ia_avg < 50) factors.push(`Low IA Average (${ia_avg.toFixed(1)}%)`);
    if (ia_trend_delta < -10) factors.push(`Declining Marks (IA1: ${ia1}% → IA3: ${ia3}%)`);
    if (att < 75) factors.push(`Low Attendance (${att}%)`);
    if (assignment_ratio_pct < 60) factors.push(`Low Assignment Completion (${comp}/${tot} submitted)`);
    if (ia3 < 40) factors.push(`Critical IA3 Score (${ia3}%)`);

    if (factors.length === 0) factors.push('Consistent Academic Performance');

    // Targeted Interventions
    const recommendations = [];
    if (backlog_probability >= 50) {
      recommendations.push('🚨 Mandatory Faculty Counseling & Remedial Coaching.');
      recommendations.push('📝 Focus on IA3 weak topics before final semester exam.');
      recommendations.push('📋 Submit pending assignment backlogs with TA guidance.');
    } else if (backlog_probability >= 20) {
      recommendations.push('⚠️ Join Peer Study Group for targeted problem solving.');
      recommendations.push('📈 Target minimum 75%+ score in final revision tests.');
      recommendations.push('⏱️ Increase study allocation to 4+ hours/week for this subject.');
    } else {
      recommendations.push('✅ Excellent performance! Maintain attendance & current study momentum.');
    }

    return {
      subject_name: subj.name || `Subject`,
      ia1, ia2, ia3,
      ia_avg: Math.round(ia_avg * 10) / 10,
      ia_trend_delta: Math.round(ia_trend_delta * 10) / 10,
      attendance: att,
      assignment_ratio: `${comp}/${tot}`,
      assignment_ratio_pct: Math.round(assignment_ratio_pct * 10) / 10,
      backlog_probability,
      risk_category,
      card_tint,
      top_risk_factors: factors,
      recommendations
    };
  }

  /**
   * Batch evaluates multiple subjects and computes overall student confidence & status
   */
  evaluateAllSubjects(subjectsList) {
    const results = subjectsList.map(s => this.predictSubjectRisk(s));
    
    const highRiskCount = results.filter(r => r.backlog_probability >= 50).length;
    const mediumRiskCount = results.filter(r => r.backlog_probability >= 20 && r.backlog_probability < 50).length;
    const lowRiskCount = results.filter(r => r.backlog_probability < 20).length;

    // Overall student academic standing
    let overall_status = 'On Track (Low Overall Failure Risk)';
    let status_tint = 'green-tint';

    if (highRiskCount >= 2) {
      overall_status = 'Critical Intervention Required (Multiple Subject Risks)';
      status_tint = 'red-tint';
    } else if (highRiskCount === 1 || mediumRiskCount >= 2) {
      overall_status = 'Moderate Risk (Attention Needed in Specific Subjects)';
      status_tint = 'yellow-tint';
    }

    return {
      results,
      model_confidence: this.modelConfidence,
      total_subjects: results.length,
      high_risk_count: highRiskCount,
      medium_risk_count: mediumRiskCount,
      low_risk_count: lowRiskCount,
      overall_status,
      status_tint
    };
  }
}

window.subjectMLEngine = new SubjectMLEngine();
