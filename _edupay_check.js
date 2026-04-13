
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DATA (with localStorage persistence)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const DEFAULT_STUDENTS = [
  { id:'STU001', name:'Ashish Sharma', program:'B.Tech CSE', sem:5, total:90000, paid:67500 },
  { id:'STU002', name:'Priya Verma',   program:'B.Tech ECE', sem:3, total:90000, paid:45000 },
  { id:'STU003', name:'Rohit Singh',   program:'B.Tech ME',  sem:7, total:85000, paid:85000 },
  { id:'STU004', name:'Ananya Gupta',  program:'MCA',        sem:1, total:70000, paid:35000 },
  { id:'STU005', name:'Vikram Yadav',  program:'B.Tech CSE', sem:5, total:90000, paid:22500 },
  { id:'STU006', name:'Neha Joshi',    program:'MBA',        sem:2, total:80000, paid:0      },
];
const DEFAULT_RECEIPTS = [
  { id:'RCP-2401', student:'STU001', name:'Ashish Sharma', type:'Tuition Fee',    amount:22500, date:'2024-07-10', status:'paid',    sem:5 },
  { id:'RCP-2402', student:'STU001', name:'Ashish Sharma', type:'Hostel Fee',     amount:18000, date:'2024-07-12', status:'paid',    sem:5 },
  { id:'RCP-2403', student:'STU001', name:'Ashish Sharma', type:'Lab Fee',        amount:5000,  date:'2024-08-01', status:'paid',    sem:5 },
  { id:'RCP-2404', student:'STU001', name:'Ashish Sharma', type:'Semester Fee',   amount:22500, date:'2025-01-15', status:'pending', sem:5 },
  { id:'RCP-2405', student:'STU002', name:'Priya Verma',   type:'Tuition Fee',    amount:22500, date:'2024-07-10', status:'paid',    sem:3 },
  { id:'RCP-2406', student:'STU002', name:'Priya Verma',   type:'Semester Fee',   amount:22500, date:'2025-01-15', status:'overdue', sem:3 },
  { id:'RCP-2407', student:'STU003', name:'Rohit Singh',   type:'Semester Fee',   amount:22500, date:'2024-12-10', status:'paid',    sem:7 },
  { id:'RCP-2408', student:'STU004', name:'Ananya Gupta',  type:'Admission Fee',  amount:15000, date:'2024-08-01', status:'paid',    sem:1 },
  { id:'RCP-2409', student:'STU005', name:'Vikram Yadav',  type:'Semester Fee',   amount:22500, date:'2024-12-01', status:'overdue', sem:5 },
  { id:'RCP-2410', student:'STU006', name:'Neha Joshi',    type:'Tuition Fee',    amount:20000, date:'2025-01-05', status:'overdue', sem:2 },
];

function loadData() {
  try {
    const s = localStorage.getItem('edupay_students');
    const r = localStorage.getItem('edupay_receipts');
    STUDENTS = s ? JSON.parse(s) : JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
    RECEIPTS = r ? JSON.parse(r) : JSON.parse(JSON.stringify(DEFAULT_RECEIPTS));
    // Sync dynamically added students into USERS
    STUDENTS.forEach(stu => {
      if (!USERS[stu.id]) {
        USERS[stu.id] = {
          pass: 'pass123',
          role: 'student',
          name: stu.name,
          initials: stu.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
          sem: stu.sem,
          branch: stu.program
        };
      }
    });
  } catch(e) {
    STUDENTS = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
    RECEIPTS = JSON.parse(JSON.stringify(DEFAULT_RECEIPTS));
  }
}
function saveData() {
  localStorage.setItem('edupay_students', JSON.stringify(STUDENTS));
  localStorage.setItem('edupay_receipts', JSON.stringify(RECEIPTS));
}

const USERS = {
  admin001: { pass:'admin123', role:'admin', name:'Dr. Ramesh Kumar', initials:'RK' },
  STU001: { pass:'pass123', role:'student', name:'Ashish Sharma', initials:'AS', sem:5, branch:'B.Tech CSE' },
  STU002: { pass:'pass123', role:'student', name:'Priya Verma', initials:'PV', sem:3, branch:'B.Tech ECE' },
};

const NOTIFS = [
  { icon:'FR', title:'Fee Reminder - Semester Fee Due', desc:'Your Semester Fee of Rs.22,500 is due on Jan 15, 2025.', time:'2 hours ago', sent:'All Students' },
  { icon:'OA', title:'Overdue Alert - Immediate Action', desc:'Your fee payment is overdue. Late fine of Rs.500 will be applied.', time:'Yesterday', sent:'Overdue Only' },
  { icon:'PC', title:'Payment Confirmed - RCP-2403', desc:'Your Lab Fee payment of Rs.5,000 has been confirmed.', time:'3 days ago', sent:'STU001' },
  { icon:'NW', title:'Winter Break Fee Waiver', desc:'Late fine waived for payments before Jan 5, 2025.', time:'1 week ago', sent:'All Students' },
];

const STU_FEES = [
  { type:'Tuition Fee',  total:45000, paid:45000, due:'Paid', status:'paid'    },
  { type:'Hostel Fee',   total:18000, paid:18000, due:'Paid', status:'paid'    },
  { type:'Lab Fee',      total:5000,  paid:5000,  due:'Paid', status:'paid'    },
  { type:'Semester Fee', total:22500, paid:0,     due:'Jan 15, 2025', status:'pending' },
];

const VAULT_DOCS = [
  { icon:'PDF', name:'Semester 5 Fee Receipt - Jul 2024.pdf',  size:'124 KB', type:'Receipt'  },
  { icon:'PDF', name:'Hostel Fee Receipt - Jul 2024.pdf',      size:'118 KB', type:'Receipt'  },
  { icon:'DOC', name:'Admission Letter 2022.pdf',              size:'2.1 MB', type:'Document' },
  { icon:'ID',  name:'Student ID Card (Digital).png',          size:'340 KB', type:'ID'       },
  { icon:'PDF', name:'Fee Structure 2024-25.pdf',              size:'560 KB', type:'Notice'   },
];

let currentRole = 'admin';
let currentUser = null;
let currentReceiptData = null;
const chartInstances = {};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// AUTH
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function selectRole(r, btn) {
  currentRole = r;
  document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('loginUser').value = r === 'admin' ? 'admin001' : 'STU001';
  document.getElementById('loginPass').value = r === 'admin' ? 'admin123' : 'pass123';
}

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();
  const user = USERS[u];
  if (!user || user.pass !== p) { showToast('Invalid credentials. Try again.'); return; }
  currentUser = { ...user, id: u };
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').classList.add('visible');
  setupUI();
}

function doLogout() {
  currentUser = null;
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('app').classList.remove('visible');
}

function showRegister() {
  // Generate next student ID
  const existingIds = STUDENTS.map(s => parseInt(s.id.replace('STU', '')) || 0);
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  const newId = 'STU' + String(maxId + 1).padStart(3, '0');
  document.getElementById('regId').value = newId;
  document.getElementById('regName').value = '';
  document.getElementById('regTotal').value = '';
  document.getElementById('regModal').classList.add('open');
}
function closeRegister() {
  document.getElementById('regModal').classList.remove('open');
}
function doRegister() {
  const id = document.getElementById('regId').value.trim();
  const name = document.getElementById('regName').value.trim();
  const program = document.getElementById('regProgram').value;
  const sem = parseInt(document.getElementById('regSem').value);
  const total = parseInt(document.getElementById('regTotal').value) || 0;
  if (!name) { showToast('Please enter your name'); return; }
  if (total <= 0) { showToast('Please enter a valid total fee'); return; }
  if (STUDENTS.find(s => s.id === id)) { showToast('This ID already exists. Try refreshing.'); return; }
  STUDENTS.push({ id, name, program, sem, total, paid: 0 });
  USERS[id] = { pass: 'pass123', role: 'student', name, initials: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2), sem, branch: program };
  saveData();
  closeRegister();
  showToast(`Registered successfully. Your ID: ${id} | Password: pass123`);
  // Auto-login after registration
  document.getElementById('loginUser').value = id;
  document.getElementById('loginPass').value = 'pass123';
  doLogin();
}

function setupUI() {
  const r = currentUser.role;
  document.getElementById('sideAvatar').textContent = currentUser.initials;
  document.getElementById('sideAvatar').className = `avatar ${r}`;
  document.getElementById('sideUserName').textContent = currentUser.name;
  document.getElementById('sideUserRole').textContent = r === 'admin' ? 'Administrator' : 'Student';
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = r==='admin'?'block':'none');
  document.querySelectorAll('.student-only').forEach(el => el.style.display = r==='student'?'block':'none');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const defaultNav = document.querySelector(r === 'admin' ? '#adminNav .nav-item' : '#studentNav .nav-item');
  if (defaultNav) defaultNav.classList.add('active');
  // Show first page
  if (r === 'admin') { showPage('adminDash'); renderAdminDash(); }
  else { showPage('stuDash'); renderStudentDash(); }
}

function hasChartSupport() {
  return typeof Chart !== 'undefined';
}

function destroyChart(name) {
  if (chartInstances[name]) {
    chartInstances[name].destroy();
    delete chartInstances[name];
  }
}

function showChartFallback(canvasId, message) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const parent = canvas.parentElement;
  if (!parent) return;
  const old = parent.querySelector('.chart-fallback');
  if (old) old.remove();
  canvas.style.display = 'none';
  const fallback = document.createElement('div');
  fallback.className = 'chart-fallback';
  fallback.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;min-height:220px;color:var(--text2);font-size:0.85rem;text-align:center;padding:16px;';
  fallback.textContent = message;
  parent.appendChild(fallback);
}

function clearChartFallback(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  canvas.style.display = 'block';
  const parent = canvas.parentElement;
  const fallback = parent ? parent.querySelector('.chart-fallback') : null;
  if (fallback) fallback.remove();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// NAVIGATION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function goTo(id, btn) {
  showPage(id);
  const nav = currentUser.role === 'admin' ? document.getElementById('adminNav') : document.getElementById('studentNav');
  nav.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (btn) btn.classList.add('active');
  // lazy render
  const renders = {
    adminDash: renderAdminDash,
    adminStudents: renderStudentTable,
    adminFees: renderAdminFees,
    adminNotif: renderAdminNotif,
    adminReceipts: renderAdminReceipts,
    adminAnalytics: renderAnalytics,
    stuDash: renderStudentDash,
    stuFees: renderStuFees,
    stuReceipts: renderStuReceipts,
    stuVault: renderVault,
    stuNotif: renderStuNotifs,
  };
  if (renders[id]) renders[id]();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ADMIN DASHBOARD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderAdminDash() {
  // Dynamic stats
  const totalCollected = STUDENTS.reduce((sum, s) => sum + (s.paid || 0), 0);
  const totalPending = STUDENTS.reduce((sum, s) => sum + ((s.total || 0) - (s.paid || 0)), 0);
  const paidCount = RECEIPTS.filter(r => r.status === 'paid').length;
  const overdueCount = RECEIPTS.filter(r => r.status === 'overdue').length;
  const overdueStudents = [...new Set(RECEIPTS.filter(r => r.status === 'overdue').map(r => r.student))].length;

  document.getElementById('statTotalCollected').textContent = 'Rs.' + (totalCollected >= 100000 ? (totalCollected / 100000).toFixed(1) + 'L' : totalCollected.toLocaleString());
  document.getElementById('statPendingAmount').textContent = 'Rs.' + (totalPending >= 100000 ? (totalPending / 100000).toFixed(1) + 'L' : totalPending.toLocaleString());
  document.getElementById('statPaidToday').textContent = paidCount;
  document.getElementById('statOverdueAlerts').textContent = overdueStudents;
  document.getElementById('statOverdueCount').textContent = overdueStudents + ' student' + (overdueStudents !== 1 ? 's' : '') + ' overdue';

  // Transactions table
  const tbody = document.getElementById('adminTxTable');
  tbody.innerHTML = RECEIPTS.slice(0, 6).map(r => `
    <tr>
      <td><span style="font-family:'JetBrains Mono';font-size:0.8rem;color:var(--accent)">${r.id}</span></td>
      <td><b>${r.name}</b></td>
      <td>${r.type}</td>
      <td style="font-family:'JetBrains Mono';font-weight:600">Rs.${r.amount.toLocaleString()}</td>
      <td style="color:var(--text2)">${r.date}</td>
      <td><span class="badge badge-${r.status}">${r.status.toUpperCase()}</span></td>
      <td><button class="btn btn-cyan btn-sm" onclick="openQR('${r.id}')">View</button></td>
    </tr>
  `).join('');

  // Bar Chart
  if (!hasChartSupport()) {
    showChartFallback('adminChart', 'Charts unavailable in offline mode.');
    showChartFallback('feeDonut', 'Charts unavailable in offline mode.');
    return;
  }
  clearChartFallback('adminChart');
  clearChartFallback('feeDonut');
  destroyChart('adminChart');
  destroyChart('feeDonut');

  const ctx = document.getElementById('adminChart').getContext('2d');
  chartInstances.adminChart = new Chart(ctx, {
    type:'bar',
    data:{
      labels:['Aug','Sep','Oct','Nov','Dec','Jan'],
      datasets:[{
        label:'Collected (Rs.)',
        data:(() => {
          // Group paid receipts by month
          const months = {};
          RECEIPTS.filter(r => r.status === 'paid').forEach(r => {
            const m = r.date.substring(0, 7); // YYYY-MM
            months[m] = (months[m] || 0) + r.amount;
          });
          const labels = ['Aug','Sep','Oct','Nov','Dec','Jan'];
          return labels.map(l => {
            const key = Object.keys(months)[0] || '2024-08';
            return Object.values(months)[0] || 320000;
          });
        })(),
        backgroundColor:'rgba(0,212,255,0.25)',
        borderColor:'rgba(0,212,255,0.8)',
        borderWidth:2, borderRadius:6,
      }]
    },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
      scales:{ x:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#94a3b8'}},
               y:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#94a3b8',callback:v=>'Rs.'+v/1000+'k'}} } }
  });

  // Donut - dynamic by fee type
  const ctx2 = document.getElementById('feeDonut').getContext('2d');
  const typeAmounts = {};
  RECEIPTS.filter(r => r.status === 'paid').forEach(r => {
    typeAmounts[r.type] = (typeAmounts[r.type] || 0) + r.amount;
  });
  const typeLabels = Object.keys(typeAmounts);
  const typeData = Object.values(typeAmounts);
  chartInstances.feeDonut = new Chart(ctx2, {
    type:'doughnut',
    data:{
      labels: typeLabels.length ? typeLabels : ['No Data'],
      datasets:[{ data: typeData.length ? typeData : [1],
        backgroundColor:['rgba(0,212,255,0.7)','rgba(124,58,237,0.7)','rgba(16,185,129,0.7)','rgba(245,158,11,0.7)','rgba(239,68,68,0.7)'],
        borderWidth:2, borderColor:'#0d1224' }]
    },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'right',labels:{color:'#94a3b8',font:{size:11}}}} }
  });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ADMIN STUDENT TABLE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderStudentTable(filter='') {
  const tbody = document.getElementById('studentTable');
  const data = filter ? STUDENTS.filter(s=>s.name.toLowerCase().includes(filter)||s.id.toLowerCase().includes(filter)) : STUDENTS;
  tbody.innerHTML = data.map(s => {
    const bal = s.total - s.paid;
    const pct = Math.round(s.paid/s.total*100);
    const st = bal===0?'paid':pct===0?'overdue':'partial';
    return `<tr>
      <td><span style="font-family:'JetBrains Mono';color:var(--accent);font-size:0.8rem">${s.id}</span></td>
      <td><b>${s.name}</b></td>
      <td>${s.program} · Sem ${s.sem}</td>
      <td style="font-family:'JetBrains Mono'">Rs.${s.total.toLocaleString()}</td>
      <td style="font-family:'JetBrains Mono';color:var(--accent3)">Rs.${s.paid.toLocaleString()}</td>
      <td style="font-family:'JetBrains Mono';color:${bal>0?'var(--warn)':'var(--accent3)'}">Rs.${bal.toLocaleString()}</td>
      <td style="min-width:120px"><div class="progress-bar"><div class="progress-fill ${pct===100?'progress-green':pct>50?'progress-cyan':'progress-warn'}" style="width:${pct}%"></div></div><small style="color:var(--text2)">${pct}%</small></td>
      <td><span class="badge badge-${st}">${st.toUpperCase()}</span></td>
      <td style="display:flex;gap:5px">
        <button class="btn btn-cyan btn-sm" onclick="showToast('Reminder sent to ${s.name}')">Remind</button>
        ${bal > 0 ? `<button class="btn btn-green btn-sm" onclick="openPaymentModal('${s.id}')">Pay</button>` : `<button class="btn btn-green btn-sm" disabled style="opacity:0.4">Done</button>`}
      </td>
    </tr>`;
  }).join('');
}
function filterStudents(v) { renderStudentTable(v.toLowerCase()); }

function updateStatus(id) {
  const s = STUDENTS.find(x=>x.id===id);
  if (!s) return;
  const prevPaid = s.paid;
  s.paid = s.total; // mark fully paid
  // Create a paid receipt for the amount being paid now
  const newAmount = s.total - prevPaid;
  if (newAmount > 0) {
    const newId = 'RCP-' + (2400 + RECEIPTS.length + 1);
    RECEIPTS.push({ id:newId, student:s.id, name:s.name, type:'Semester Fee', amount:newAmount, date:new Date().toISOString().split('T')[0], status:'paid', sem:s.sem });
  }
  saveData();
  renderStudentTable();
  showToast(`${s.name} marked as fully paid`);
}

let currentPayStudent = null;
function openPaymentModal(id) {
  const s = STUDENTS.find(x=>x.id===id);
  if (!s) return;
  currentPayStudent = s;
  const bal = s.total - s.paid;
  document.getElementById('payStudentInfo').textContent = `${s.name} (${s.id}) - ${s.program} Sem ${s.sem}`;
  document.getElementById('payTotal').textContent = 'Rs.' + s.total.toLocaleString();
  document.getElementById('payAlreadyPaid').textContent = 'Rs.' + s.paid.toLocaleString();
  document.getElementById('payRemaining').textContent = 'Rs.' + bal.toLocaleString();
  document.getElementById('payAmount').max = bal;
  document.getElementById('payAmount').placeholder = 'Max: Rs.' + bal.toLocaleString();
  document.getElementById('payAmount').value = '';
  document.getElementById('payDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('payModal').classList.add('open');
}
function closePay() {
  document.getElementById('payModal').classList.remove('open');
  currentPayStudent = null;
}
function recordPayment() {
  if (!currentPayStudent) return;
  const s = currentPayStudent;
  const amount = parseInt(document.getElementById('payAmount').value) || 0;
  const feeType = document.getElementById('payType').value;
  const date = document.getElementById('payDate').value;
  if (amount <= 0) { showToast('Please enter a valid amount'); return; }
  const bal = s.total - s.paid;
  if (amount > bal) { showToast('Amount exceeds remaining balance'); return; }
  // Update student paid
  s.paid += amount;
  // Create receipt
  const newId = 'RCP-' + (2400 + RECEIPTS.length + 1);
  RECEIPTS.push({ id:newId, student:s.id, name:s.name, type:feeType, amount:amount, date:date, status:'paid', sem:s.sem });
  saveData();
  closePay();
  renderStudentTable();
  const newBal = s.total - s.paid;
  if (newBal === 0) {
    showToast(`${s.name} - Full payment (Rs.${amount.toLocaleString()}) recorded.`);
  } else {
    showToast(`Rs.${amount.toLocaleString()} recorded for ${s.name}. Remaining: Rs.${newBal.toLocaleString()}`);
  }
}

function showAddStudentForm() {
  document.getElementById('addStudentForm').style.display = 'block';
}
function hideAddStudentForm() {
  document.getElementById('addStudentForm').style.display = 'none';
}
function addStudent() {
  const id = document.getElementById('newStuId').value.trim();
  const name = document.getElementById('newStuName').value.trim();
  const program = document.getElementById('newStuProgram').value;
  const sem = parseInt(document.getElementById('newStuSem').value);
  const total = parseInt(document.getElementById('newStuTotal').value) || 0;
  const paid = parseInt(document.getElementById('newStuPaid').value) || 0;
  if (!id || !name) { showToast('Please fill ID and Name'); return; }
  if (STUDENTS.find(s=>s.id===id)) { showToast('Student ID already exists'); return; }
  STUDENTS.push({ id, name, program, sem, total, paid });
  USERS[id] = { pass:'pass123', role:'student', name, initials:name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2), sem, branch:program };
  saveData();
  renderStudentTable();
  hideAddStudentForm();
  showToast(`${name} (${id}) added successfully.`);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ADMIN FEES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderAdminFees() {
  const tbody = document.getElementById('adminFeesTable');
  tbody.innerHTML = RECEIPTS.map(r => `
    <tr>
      <td><span style="font-family:'JetBrains Mono';font-size:0.8rem;color:var(--accent)">${r.id}</span></td>
      <td>${r.name}</td>
      <td>${r.type}</td>
      <td style="font-family:'JetBrains Mono';font-weight:600">Rs.${r.amount.toLocaleString()}</td>
      <td style="color:var(--text2)">${r.date}</td>
      <td><span class="badge badge-${r.status}">${r.status.toUpperCase()}</span></td>
      <td>
        <select onchange="changeStatus('${r.id}',this.value)" style="background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:5px 10px;border-radius:6px;font-size:0.8rem;cursor:pointer;">
          <option ${r.status==='paid'?'selected':''}>paid</option>
          <option ${r.status==='pending'?'selected':''}>pending</option>
          <option ${r.status==='overdue'?'selected':''}>overdue</option>
          <option ${r.status==='partial'?'selected':''}>partial</option>
        </select>
      </td>
      <td><button class="btn btn-purple btn-sm" onclick="openQR('${r.id}')">View</button></td>
    </tr>
  `).join('');
}

function changeStatus(id, val) {
  const r = RECEIPTS.find(x=>x.id===id);
  if (r) {
    r.status = val;
    // If marking as paid, also update student paid amount
    if (val === 'paid') {
      const s = STUDENTS.find(x => x.id === r.student);
      if (s) {
        // Find existing paid for this fee type and add
        const existingPaid = RECEIPTS.filter(x => x.student === s.id && x.status === 'paid').reduce((sum, x) => sum + x.amount, 0);
        s.paid = existingPaid;
      }
    }
    saveData();
    showToast(`${id} status -> ${val}`);
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// QR RECEIPT MODAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function openQR(id) {
  const r = RECEIPTS.find(x=>x.id===id);
  if (!r) return;
  currentReceiptData = r;
  document.getElementById('qrModal').classList.add('open');
  const box = document.getElementById('qrBox');
  box.innerHTML = '';

  if (r.status !== 'paid') {
    // Show pending message instead of QR
    box.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <div style="font-size:3rem;margin-bottom:12px;">Pending</div>
        <div style="color:#f59e0b;font-weight:700;font-size:1rem;margin-bottom:6px;">Payment Pending</div>
        <div style="color:#94a3b8;font-size:0.82rem;">QR code will be generated<br>after payment confirmation</div>
      </div>
    `;
    document.getElementById('qrInfo').innerHTML = `
      <div class="qr-info-row"><span class="k">Receipt ID</span><span class="v">${r.id}</span></div>
      <div class="qr-info-row"><span class="k">Student</span><span class="v">${r.name} (${r.student})</span></div>
      <div class="qr-info-row"><span class="k">Fee Type</span><span class="v">${r.type}</span></div>
      <div class="qr-info-row"><span class="k">Amount</span><span class="v">Rs.${r.amount.toLocaleString()}</span></div>
      <div class="qr-info-row"><span class="k">Due Date</span><span class="v" style="color:#f59e0b">${r.date}</span></div>
      <div class="qr-info-row"><span class="k">Status</span><span class="v" style="color:#f59e0b">${r.status.toUpperCase()}</span></div>
    `;
    return;
  }

  // Generate QR only for PAID receipts
  const qrData = `EDUPAY|${r.id}|${r.student}|${r.name}|${r.type}|${r.amount}|${r.date}|${r.status}`;
  new QRCode(box, { text: qrData, width:180, height:180, colorDark:'#000', colorLight:'#fff' });
  document.getElementById('qrInfo').innerHTML = `
    <div class="qr-info-row"><span class="k">Receipt ID</span><span class="v">${r.id}</span></div>
    <div class="qr-info-row"><span class="k">Student</span><span class="v">${r.name} (${r.student})</span></div>
    <div class="qr-info-row"><span class="k">Fee Type</span><span class="v">${r.type}</span></div>
    <div class="qr-info-row"><span class="k">Amount</span><span class="v">Rs.${r.amount.toLocaleString()}</span></div>
    <div class="qr-info-row"><span class="k">Date</span><span class="v">${r.date}</span></div>
    <div class="qr-info-row"><span class="k">Status</span><span class="v" style="color:#10b981">${r.status.toUpperCase()}</span></div>
  `;
}
function closeQR() { document.getElementById('qrModal').classList.remove('open'); }
function downloadQR() {
  if (!currentReceiptData) return;
  const r = currentReceiptData;
  // Create a canvas receipt
  const canvas = document.createElement('canvas');
  canvas.width = 600; canvas.height = 800;
  const ctx = canvas.getContext('2d');
  // Background
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 600, 800);
  // Gradient header
  const grad = ctx.createLinearGradient(0, 0, 600, 0);
  grad.addColorStop(0, '#7c3aed');
  grad.addColorStop(1, '#00d4ff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 120);
  // Header text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px Syne, sans-serif';
  ctx.fillText('EDUPAY PRO', 40, 55);
  ctx.font = '14px Space Grotesk, sans-serif';
  ctx.fillText('NIET Greater Noida - Fee Receipt', 40, 80);
  // QR code from modal
  const qrImg = document.querySelector('#qrBox img');
  if (qrImg) {
    ctx.drawImage(qrImg, 210, 150, 180, 180);
  }
  // Receipt details
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 18px Syne';
  ctx.fillText('OFFICIAL FEE RECEIPT', 40, 380);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath(); ctx.moveTo(40, 395); ctx.lineTo(560, 395); ctx.stroke();
  const rows = [
    ['Receipt ID', r.id],
    ['Student Name', r.name],
    ['Student ID', r.student],
    ['Fee Type', r.type],
    ['Amount', 'Rs. ' + r.amount.toLocaleString()],
    ['Payment Date', r.date],
    ['Status', 'PAID'],
  ];
  rows.forEach((row, i) => {
    const y = 430 + i * 32;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px Space Grotesk';
    ctx.fillText(row[0], 40, y);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 14px JetBrains Mono';
    ctx.fillText(row[1], 300, y);
  });
  // Footer
  ctx.fillStyle = '#7c3aed';
  ctx.font = 'bold 14px Space Grotesk';
  ctx.fillText('Verified by EduPay Pro', 40, 740);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Space Grotesk';
  ctx.fillText('This receipt is digitally verified. No signature required.', 40, 760);
  // Download
  const link = document.createElement('a');
  link.download = `Receipt_${r.id}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast(`Receipt ${r.id} downloaded successfully.`);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ADMIN RECEIPTS PAGE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderAdminReceipts() {
  const grid = document.getElementById('adminReceiptGrid');
  grid.innerHTML = RECEIPTS.map(r => `
    <div class="receipt-card" onclick="openQR('${r.id}')">
      <div class="receipt-header">
        <h4>${r.type}</h4>
        <div class="amount">Rs.${r.amount.toLocaleString()}</div>
        <span class="badge badge-${r.status}" style="position:absolute;top:14px;right:14px">${r.status.toUpperCase()}</span>
      </div>
      <div class="receipt-body">
        <div class="receipt-row"><span class="label">Receipt ID</span><span class="value" style="font-family:'JetBrains Mono';font-size:0.8rem">${r.id}</span></div>
        <div class="receipt-row"><span class="label">Student</span><span class="value">${r.name}</span></div>
        <div class="receipt-row"><span class="label">Date</span><span class="value">${r.date}</span></div>
      </div>
      <div class="receipt-footer">
        <span style="font-size:0.78rem;color:var(--text2)">Click to view QR</span>
        <span>Open</span>
      </div>
    </div>
  `).join('');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ADMIN NOTIFICATIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderAdminNotif() {
  document.getElementById('notifHistory').innerHTML = NOTIFS.map(n => `
    <div class="notif-item">
      <div class="notif-icon">${n.icon}</div>
      <div style="flex:1">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
        <div class="notif-time">${n.time} · Sent to: ${n.sent}</div>
      </div>
      <button class="btn btn-cyan btn-sm" onclick="showToast('Notification resent')">Resend</button>
    </div>
  `).join('');
}

function sendNotif() {
  showToast('Notification sent successfully to selected students.');
  document.getElementById('pendingBadge').textContent = '2';
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ADMIN ANALYTICS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderAnalytics() {
  // Forecast chart
  if (!hasChartSupport()) {
    showChartFallback('forecastChart', 'Analytics chart unavailable in offline mode.');
  } else {
    clearChartFallback('forecastChart');
    destroyChart('forecastChart');
  const ctx = document.getElementById('forecastChart').getContext('2d');
  chartInstances.forecastChart = new Chart(ctx, {
    type:'line',
    data:{
      labels:['Jan','Feb','Mar'],
      datasets:[
        { label:'Predicted', data:[380000,420000,460000], borderColor:'rgba(0,212,255,0.8)', backgroundColor:'rgba(0,212,255,0.1)', fill:true, tension:0.4, borderDash:[5,5] },
        { label:'Historical', data:[500000,null,null], borderColor:'rgba(124,58,237,0.8)', backgroundColor:'rgba(124,58,237,0.1)', fill:true, tension:0.4 },
      ]
    },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:'#94a3b8'}}},
      scales:{ x:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#94a3b8'}},
               y:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#94a3b8',callback:v=>'Rs.'+v/1000+'k'}} } }
  });
  }

  // Risk list
  document.getElementById('riskList').innerHTML = `
    <div style="font-size:0.8rem;color:var(--text2);margin-bottom:12px;">Students at risk of missing deadline:</div>
    ${[{n:'Neha Joshi',risk:92},{n:'Vikram Yadav',risk:78},{n:'Priya Verma',risk:65}].map(s=>`
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="flex:1;font-size:0.88rem">${s.n}</div>
        <div class="progress-bar" style="width:120px"><div class="progress-fill progress-danger" style="width:${s.risk}%"></div></div>
        <div style="font-family:'JetBrains Mono';font-size:0.8rem;color:var(--danger)">${s.risk}%</div>
      </div>`).join('')}
  `;

  // Insights
  const insights = [
    {color:'#00d4ff',label:'Average collection time reduced by 18% this semester',val:'Up Efficiency'},
    {color:'#10b981',label:'October had the highest single-day collection: Rs.1.2L',val:'Peak Day'},
    {color:'#f59e0b',label:'Hostel fee has the highest default rate (14%)',val:'Risk Area'},
    {color:'#7c3aed',label:'AI model accuracy for deadline prediction: 84.3%',val:'AI Score'},
  ];
  document.getElementById('insightList').innerHTML = insights.map(i=>`
    <div class="insight-row">
      <div class="insight-dot" style="background:${i.color}"></div>
      <div class="insight-label">${i.label}</div>
      <div class="insight-val" style="color:${i.color}">${i.val}</div>
    </div>`).join('');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STUDENT DASHBOARD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderStudentDash() {
  const stu = STUDENTS.find(s => s.id === currentUser.id) || {};
  const stuTotal = stu.total || 0;
  const stuPaid = stu.paid || 0;
  const stuBal = stuTotal - stuPaid;
  const pct = stuTotal > 0 ? Math.round(stuPaid / stuTotal * 100) : 0;

  document.getElementById('stuWelcomeName').textContent = currentUser.name.split(' ')[0];

  // Update fee progress card with real data
  const feeCard = document.querySelector('.fee-progress-card');
  if (feeCard) {
    feeCard.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-size:0.8rem;color:var(--text2);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Total Annual Fee</div>
          <div class="fee-total">Rs.${stuTotal.toLocaleString()}</div>
          <div class="fee-sub">${stu.program || 'B.Tech CSE'} - Semester ${stu.sem || 5} · NIET Greater Noida</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.8rem;color:var(--text2);">Paid So Far</div>
          <div style="font-family:'Syne';font-size:1.6rem;font-weight:800;color:var(--accent3);">Rs.${stuPaid.toLocaleString()}</div>
          <div style="font-size:0.8rem;color:${stuBal > 0 ? 'var(--warn)' : 'var(--accent3)'};">${stuBal > 0 ? 'Rs.' + stuBal.toLocaleString() + ' remaining' : 'Fully Paid'}</div>
        </div>
      </div>
      <div style="margin-top:20px;">
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text2);margin-bottom:6px;"><span>Payment Progress</span><span style="font-weight:700;color:var(--accent);">${pct}%</span></div>
        <div class="progress-bar"><div class="progress-fill ${pct === 100 ? 'progress-green' : pct > 50 ? 'progress-cyan' : 'progress-warn'}" style="width:${pct}%"></div></div>
      </div>
    `;
  }

  // Update stats with real data
  const paidCount = RECEIPTS.filter(r => r.student === currentUser.id && r.status === 'paid').length;
  const pendingCount = RECEIPTS.filter(r => r.student === currentUser.id && r.status !== 'paid').length;
  const statCards = document.querySelectorAll('#stuDash .stat-card');
  if (statCards[0]) statCards[0].querySelector('.stat-value').textContent = paidCount;
  if (statCards[1]) statCards[1].querySelector('.stat-value').textContent = pendingCount;
  if (statCards[2]) statCards[2].querySelector('.stat-value').textContent = paidCount;
  if (statCards[3]) {
    const record = stuBal === 0 ? 'On Time' : 'Pending';
    statCards[3].querySelector('.stat-value').textContent = record;
    statCards[3].querySelector('.stat-label').textContent = stuBal === 0 ? 'Payment Record' : 'Balance Due';
  }

  // Chart - dynamic from receipts
  const myReceipts = RECEIPTS.filter(r => r.student === currentUser.id && r.status === 'paid');
  const chartLabels = myReceipts.map(r => r.date);
  const chartData = myReceipts.map(r => r.amount);

  setTimeout(() => {
    const ctx = document.getElementById('stuChart');
    if (ctx && !hasChartSupport()) {
      showChartFallback('stuChart', 'Payment chart unavailable in offline mode.');
      return;
    }
    if (ctx) {
      clearChartFallback('stuChart');
      destroyChart('stuChart');
      chartInstances.stuChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: chartLabels.length ? chartLabels : ['No Data'],
          datasets: [{
            label: 'Amount Paid (Rs.)',
            data: chartData.length ? chartData : [0],
            backgroundColor: chartData.length ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.2)',
            borderColor: chartData.length ? 'rgba(16,185,129,0.9)' : 'rgba(245,158,11,0.5)',
            borderWidth: 2, borderRadius: 6,
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
          scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                   y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => 'Rs.' + v / 1000 + 'k' } } } }
      });
    }
  }, 100);

  // Alerts from real receipts
  const myNotifs = RECEIPTS.filter(r => r.student === currentUser.id).slice(-3).reverse();
  document.getElementById('stuAlertList').innerHTML = myNotifs.length ? myNotifs.map(n => `
    <div class="notif-item">
      <div class="notif-icon">${n.status === 'paid' ? 'PA' : n.status === 'overdue' ? 'OD' : 'PN'}</div>
      <div>
        <div class="notif-title">${n.type} - ${n.status === 'paid' ? 'Paid' : n.status === 'overdue' ? 'Overdue' : 'Pending'}</div>
        <div class="notif-time">${n.date} · Rs.${n.amount.toLocaleString()}</div>
      </div>
    </div>`).join('') : '<div style="color:var(--text2);font-size:0.85rem;padding:12px;">No payment history yet</div>';
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STUDENT FEE TABLE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderStuFees() {
  const stu = STUDENTS.find(s => s.id === currentUser.id) || {};
  const stuReceipts = RECEIPTS.filter(r => r.student === currentUser.id);
  const stuTotal = stu.total || 0;
  const stuPaid = stu.paid || 0;
  const stuBal = stuTotal - stuPaid;

  // Group receipts by type for display
  const feeTypes = {};
  stuReceipts.forEach(r => {
    if (!feeTypes[r.type]) feeTypes[r.type] = { total: 0, paid: 0, due: 'Paid', status: 'paid' };
    if (r.status === 'paid') feeTypes[r.type].paid += r.amount;
    else if (r.status === 'overdue') { feeTypes[r.type].status = 'overdue'; feeTypes[r.type].due = r.date; }
    else if (r.status === 'pending') { feeTypes[r.type].status = 'pending'; feeTypes[r.type].due = r.date; }
  });

  if (Object.keys(feeTypes).length === 0) {
    // Default view if no receipts
    const types = ['Semester Fee', 'Tuition Fee', 'Hostel Fee', 'Lab Fee'];
    const amounts = [22500, 45000, 18000, 5000];
    document.getElementById('stuFeeTable').innerHTML = types.map((t, i) => {
      const total = amounts[i];
      const bal = stuTotal - stuPaid;
      const remaining = i === 0 ? bal : 0;
      const status = remaining === 0 ? 'paid' : remaining > 0 ? 'pending' : 'overdue';
      return `<tr>
        <td><b>${t}</b></td>
        <td style="font-family:'JetBrains Mono'">Rs.${total.toLocaleString()}</td>
        <td style="font-family:'JetBrains Mono';color:var(--accent3)">Rs.${i === 0 ? (stuPaid > total ? total : stuPaid) : 0}</td>
        <td style="font-family:'JetBrains Mono';color:${remaining > 0 ? 'var(--warn)' : 'var(--accent3)'}">Rs.${remaining}</td>
        <td style="color:var(--text2)">${remaining > 0 ? 'Jan 15, 2025' : 'Paid'}</td>
        <td><span class="badge badge-${status}">${status.toUpperCase()}</span></td>
      </tr>`;
    }).join('');
  } else {
    document.getElementById('stuFeeTable').innerHTML = Object.entries(feeTypes).map(([type, data]) => `
      <tr>
        <td><b>${type}</b></td>
        <td style="font-family:'JetBrains Mono'">Rs.${(data.total || data.paid).toLocaleString()}</td>
        <td style="font-family:'JetBrains Mono';color:var(--accent3)">Rs.${data.paid.toLocaleString()}</td>
        <td style="font-family:'JetBrains Mono';color:${data.status !== 'paid' ? 'var(--warn)' : 'var(--accent3)'}">Rs.0</td>
        <td style="color:var(--text2)">${data.due}</td>
        <td><span class="badge badge-${data.status}">${data.status.toUpperCase()}</span></td>
      </tr>`).join('');
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STUDENT RECEIPTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderStuReceipts() {
  const myRec = RECEIPTS.filter(r=>r.student===currentUser.id);
  const grid = document.getElementById('stuReceiptGrid');
  grid.innerHTML = myRec.map(r=>`
    <div class="receipt-card" onclick="openQR('${r.id}')">
      <div class="receipt-header">
        <h4>${r.type}</h4>
        <div class="amount">Rs.${r.amount.toLocaleString()}</div>
        <span class="badge badge-${r.status}" style="position:absolute;top:14px;right:14px">${r.status.toUpperCase()}</span>
      </div>
      <div class="receipt-body">
        <div class="receipt-row"><span class="label">Receipt ID</span><span class="value" style="font-family:'JetBrains Mono';font-size:0.8rem">${r.id}</span></div>
        <div class="receipt-row"><span class="label">Date</span><span class="value">${r.date}</span></div>
        <div class="receipt-row"><span class="label">Semester</span><span class="value">Sem ${r.sem}</span></div>
      </div>
      <div class="receipt-footer">
        <span style="font-size:0.78rem;color:var(--text2)">Tap for QR Receipt</span>
        <span>Open</span>
      </div>
    </div>`).join('');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STUDENT VAULT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderVault() {
  document.getElementById('vaultList').innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding:12px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:8px;">
      <span>Safe</span>
      <div style="font-size:0.82rem;color:var(--accent3)">All documents are encrypted with AES-256. Only you can access them.</div>
    </div>
    ${VAULT_DOCS.map(d=>`
      <div class="vault-item">
        <div class="vault-icon">${d.icon}</div>
        <div>
          <div class="vault-name">${d.name}</div>
          <div class="vault-size">${d.type} · ${d.size}</div>
        </div>
        <div class="vault-actions">
          <button class="btn btn-cyan btn-sm" onclick="showToast('Downloading ${d.name}')">Download</button>
          <button class="btn btn-purple btn-sm" onclick="showToast('Share link copied')">Share</button>
        </div>
      </div>`).join('')}`;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STUDENT NOTIFICATIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderStuNotifs() {
  document.getElementById('stuNotifList').innerHTML = NOTIFS.map((n,i)=>`
    <div class="notif-item" onclick="this.style.opacity=0.6">
      <div class="notif-icon">${n.icon}</div>
      <div style="flex:1">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      ${i<2?'<div style="width:8px;height:8px;border-radius:50%;background:var(--accent);flex-shrink:0;margin-top:4px;"></div>':''}
    </div>`).join('');
  document.getElementById('stuNotifBadge').textContent = '0';
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// TOAST
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 3000);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// INIT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
window.onload = () => {
  loadData();
};

