const state = {
  year: 2569,
  term: 1
};

const yearEl = document.getElementById('year');
const termEl = document.getElementById('term');
const outputEl = document.getElementById('output');

for (let y = 2560; y <= 2575; y++) {
  const opt = document.createElement('option');
  opt.value = y;
  opt.textContent = y;
  yearEl.appendChild(opt);
}
yearEl.value = String(state.year);
termEl.value = String(state.term);

function getPeriod() {
  state.year = Number(yearEl.value);
  state.term = Number(termEl.value);
  return { year: state.year, term: state.term };
}

async function apiGet(action, params = {}) {
  const query = new URLSearchParams({ action, ...params }).toString();

  // Use same-origin Pages Function to avoid browser CORS issues.
  const res = await fetch(`/api/pp6?${query}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    cache: 'no-store'
  });

  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'API error');
  return data;
}

async function loadDashboard() {
  const { year, term } = getPeriod();
  outputEl.textContent = 'กำลังโหลด...';

  try {
    const data = await apiGet('dashboard', { year, term });

    document.getElementById('kpiSubjects').textContent = data.data.subjects;
    document.getElementById('kpiClasses').textContent = data.data.classes;
    document.getElementById('kpiStudents').textContent = data.data.students;
    document.getElementById('kpiAssignments').textContent = data.data.assignments;

    outputEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    outputEl.textContent = `เกิดข้อผิดพลาด: ${err.message}`;
  }
}

document.getElementById('loadBtn').addEventListener('click', loadDashboard);
document.getElementById('refreshBtn').addEventListener('click', loadDashboard);
yearEl.addEventListener('change', loadDashboard);
termEl.addEventListener('change', loadDashboard);

loadDashboard();
