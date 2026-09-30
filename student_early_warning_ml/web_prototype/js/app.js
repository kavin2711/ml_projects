/**
 * Student Early Warning System (Subject-Wise) - Main Application Controller
 * Manages 3 Glassmorphism Interfaces, dynamic subject block generation, 2:1 split screen, and results rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  let subjectCount = 5;
  let subjectsList = [];

  const defaultNames = [
    'Data Structures & Algorithms',
    'Database Management Systems',
    'Operating Systems',
    'Computer Networks',
    'Theory of Computation',
    'Software Engineering',
    'Machine Learning',
    'Object Oriented Programming'
  ];

  // DOM Screen Containers
  const screen1 = document.getElementById('screen-1');
  const screen2 = document.getElementById('screen-2');
  const screen3 = document.getElementById('screen-3');

  // DOM Elements - Screen 1
  const inputNumSubjects = document.getElementById('num-subjects');
  const btnStartSetup = document.getElementById('btn-start-setup');

  // DOM Elements - Screen 2
  const subjectsContainer = document.getElementById('subjects-container');
  const btnAddSubject = document.getElementById('btn-add-subject');
  const inputRemoveId = document.getElementById('input-remove-id');
  const btnRemoveSubject = document.getElementById('btn-remove-subject');
  const btnSubmitData = document.getElementById('btn-submit-data');

  // DOM Elements - Screen 3
  const elemConfidenceVal = document.getElementById('confidence-val');
  const elemOverallStatus = document.getElementById('overall-status');
  const resultsGrid = document.getElementById('results-grid');
  const btnEditInputs = document.getElementById('btn-edit-inputs');

  // --- SCREEN 1 EVENT HANDLERS ---
  btnStartSetup.addEventListener('click', () => {
    const val = parseInt(inputNumSubjects.value);
    if (isNaN(val) || val < 1 || val > 15) {
      alert('Please enter a valid number of subjects between 1 and 15.');
      return;
    }
    subjectCount = val;
    initSubjectsList(subjectCount);
    renderSubjectBlocks();
    switchScreen(screen2);
  });

  // Helper: Initialize Subjects Array with Realistic Samples
  function initSubjectsList(count) {
    subjectsList = [];
    for (let i = 1; i <= count; i++) {
      subjectsList.push({
        id: i,
        name: defaultNames[(i - 1) % defaultNames.length] || `Subject ${i}`,
        ia1: Math.min(100, Math.max(20, Math.round(65 + (Math.random() * 20 - 10)))),
        ia2: Math.min(100, Math.max(15, Math.round(60 + (Math.random() * 20 - 10)))),
        ia3: Math.min(100, Math.max(10, Math.round(55 + (Math.random() * 25 - 12)))),
        attendance: Math.min(100, Math.max(40, Math.round(78 + (Math.random() * 20 - 10)))),
        assignmentsCompleted: Math.min(10, Math.max(2, Math.round(8 + (Math.random() * 3 - 2)))),
        assignmentsTotal: 10
      });
    }
  }

  // --- SCREEN 2: DYNAMIC SUBJECT BLOCKS RENDERER ---
  function renderSubjectBlocks() {
    subjectsContainer.innerHTML = '';

    subjectsList.forEach((subj, idx) => {
      const block = document.createElement('div');
      block.className = 'subject-block-glass';
      block.id = `block-${subj.id}`;
      block.innerHTML = `
        <div class="block-header">
          <div class="block-title">Subject #${idx + 1}</div>
          <button class="btn-glass-danger btn-sm" onclick="removeSubjectById(${subj.id})">🗑️ Remove</button>
        </div>

        <div style="margin-bottom: 1rem;">
          <div class="input-field">
            <label>Subject Name / Code</label>
            <input type="text" class="glass-input input-name" data-id="${subj.id}" value="${subj.name}">
          </div>
        </div>

        <div class="block-grid">
          <div class="input-field">
            <label>IA 1 Score (%)</label>
            <input type="number" class="glass-input input-ia1" data-id="${subj.id}" min="0" max="100" value="${subj.ia1}">
          </div>

          <div class="input-field">
            <label>IA 2 Score (%)</label>
            <input type="number" class="glass-input input-ia2" data-id="${subj.id}" min="0" max="100" value="${subj.ia2}">
          </div>

          <div class="input-field">
            <label>IA 3 Score (%)</label>
            <input type="number" class="glass-input input-ia3" data-id="${subj.id}" min="0" max="100" value="${subj.ia3}">
          </div>

          <div class="input-field">
            <label>Attendance (%)</label>
            <input type="number" class="glass-input input-att" data-id="${subj.id}" min="0" max="100" value="${subj.attendance}">
          </div>

          <div class="input-field" style="min-width: 130px;">
            <label>Assignments (Completed / Total)</label>
            <div style="display: flex; gap: 5px; align-items: center; margin-top: 2px;">
              <input type="number" class="glass-input input-comp" data-id="${subj.id}" min="0" max="100" value="${subj.assignmentsCompleted}" placeholder="8" style="width: 56px; text-align: center; padding: 9px 4px; font-weight: 700; font-size: 0.95rem;">
              <span style="color: var(--text-sub); font-weight: 800; font-size: 1rem;">/</span>
              <input type="number" class="glass-input input-tot" data-id="${subj.id}" min="1" max="100" value="${subj.assignmentsTotal}" placeholder="10" style="width: 56px; text-align: center; padding: 9px 4px; font-weight: 700; font-size: 0.95rem;">
            </div>
          </div>
        </div>
      `;
      subjectsContainer.appendChild(block);
    });
  }

  // Add Subject Button (Sidebar)
  btnAddSubject.addEventListener('click', () => {
    saveCurrentInputs();
    const newId = subjectsList.length > 0 ? Math.max(...subjectsList.map(s => s.id)) + 1 : 1;
    subjectsList.push({
      id: newId,
      name: `Subject ${subjectsList.length + 1}`,
      ia1: 70,
      ia2: 65,
      ia3: 60,
      attendance: 80,
      assignmentsCompleted: 8,
      assignmentsTotal: 10
    });
    renderSubjectBlocks();
  });

  // Remove Subject Button (Sidebar)
  btnRemoveSubject.addEventListener('click', () => {
    const removeIdx = parseInt(inputRemoveId.value);
    if (isNaN(removeIdx) || removeIdx < 1 || removeIdx > subjectsList.length) {
      alert(`Invalid subject number. Please enter a number between 1 and ${subjectsList.length}.`);
      return;
    }
    saveCurrentInputs();
    subjectsList.splice(removeIdx - 1, 1);
    inputRemoveId.value = '';
    renderSubjectBlocks();
  });

  window.removeSubjectById = function(id) {
    saveCurrentInputs();
    subjectsList = subjectsList.filter(s => s.id !== id);
    renderSubjectBlocks();
  };

  // Helper: Collect Inputs from DOM
  function saveCurrentInputs() {
    subjectsList.forEach(subj => {
      const nameInput = document.querySelector(`.input-name[data-id="${subj.id}"]`);
      const ia1Input = document.querySelector(`.input-ia1[data-id="${subj.id}"]`);
      const ia2Input = document.querySelector(`.input-ia2[data-id="${subj.id}"]`);
      const ia3Input = document.querySelector(`.input-ia3[data-id="${subj.id}"]`);
      const attInput = document.querySelector(`.input-att[data-id="${subj.id}"]`);
      const compInput = document.querySelector(`.input-comp[data-id="${subj.id}"]`);
      const totInput = document.querySelector(`.input-tot[data-id="${subj.id}"]`);

      if (nameInput) subj.name = nameInput.value;
      if (ia1Input) subj.ia1 = parseFloat(ia1Input.value) || 0;
      if (ia2Input) subj.ia2 = parseFloat(ia2Input.value) || 0;
      if (ia3Input) subj.ia3 = parseFloat(ia3Input.value) || 0;
      if (attInput) subj.attendance = parseFloat(attInput.value) || 0;
      if (compInput) subj.assignmentsCompleted = parseInt(compInput.value) || 0;
      if (totInput) subj.assignmentsTotal = parseInt(totInput.value) || 10;
    });
  }

  // Submit Data & Trigger ML Evaluation
  btnSubmitData.addEventListener('click', () => {
    saveCurrentInputs();
    if (subjectsList.length === 0) {
      alert('Please add at least one subject before submitting.');
      return;
    }

    const evaluation = window.subjectMLEngine.evaluateAllSubjects(subjectsList);
    renderResultsScreen(evaluation);
    switchScreen(screen3);
  });

  // --- SCREEN 3: RESULTS & TINTED GLASS CARDS RENDERER ---
  function renderResultsScreen(evaluation) {
    elemConfidenceVal.textContent = `${evaluation.model_confidence}%`;
    
    elemOverallStatus.innerHTML = `
      <div style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 4px;">Overall Standing: ${evaluation.overall_status}</div>
      <div style="font-size: 0.85rem; color: var(--text-sub);">
        ${evaluation.high_risk_count} High Risk | ${evaluation.medium_risk_count} Medium Risk | ${evaluation.low_risk_count} Low Risk Subjects
      </div>
    `;

    resultsGrid.innerHTML = '';

    evaluation.results.forEach((res, idx) => {
      const card = document.createElement('div');
      card.className = `tinted-glass-card ${res.card_tint}`;
      card.innerHTML = `
        <div>
          <div class="card-top">
            <div>
              <div style="font-size: 0.75rem; color: var(--text-sub); text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">Subject #${idx + 1}</div>
              <h3 class="subj-name-title">${res.subject_name}</h3>
            </div>
            <span class="risk-badge-text">${res.risk_category}</span>
          </div>

          <div style="margin: 1.25rem 0;">
            <div style="font-size: 0.8rem; color: var(--text-sub); font-weight: 600;">Backlog / Arrear Failure Probability</div>
            <div class="prob-meter-value">${res.backlog_probability}%</div>
          </div>

          <div class="subj-stats-pills">
            <span class="stat-tag">IA1: ${res.ia1}%</span>
            <span class="stat-tag">IA2: ${res.ia2}%</span>
            <span class="stat-tag">IA3: ${res.ia3}%</span>
            <span class="stat-tag">IA Avg: ${res.ia_avg}%</span>
            <span class="stat-tag">Att: ${res.attendance}%</span>
            <span class="stat-tag">Assign: ${res.assignment_ratio}</span>
          </div>

          <div class="rec-box">
            <strong style="color: #fff; display: block; margin-bottom: 4px;">Top Primary Risk Factor:</strong>
            <p>${res.top_risk_factors[0] || 'None'}</p>
          </div>
        </div>

        <div style="margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.88rem;">
          <strong style="color: #fff; font-size: 0.82rem; display: block; margin-bottom: 6px;">Recommended Intervention:</strong>
          <ul style="padding-left: 1.1rem; font-size: 0.8rem; color: #cbd5e1;">
            ${res.recommendations.map(r => `<li style="margin-bottom: 4px;">${r}</li>`).join('')}
          </ul>
        </div>
      `;
      resultsGrid.appendChild(card);
    });
  }

  // Edit Inputs Button Handler (Return to Screen 2)
  btnEditInputs.addEventListener('click', () => {
    switchScreen(screen2);
  });

  // Navigation Screen Switcher Helper
  function switchScreen(targetScreen) {
    [screen1, screen2, screen3].forEach(s => s.classList.remove('active'));
    targetScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
