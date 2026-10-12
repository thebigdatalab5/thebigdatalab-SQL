// Simple interactive playground logic using the employees from stage1.md
const employees = [
  {emp_id:1,name:'Asha',department:'Engineering',city:'Bengaluru',salary:90000,join_date:'2021-03-15',bonus:5000},
  {emp_id:2,name:'Ravi',department:'Engineering',city:'Hyderabad',salary:75000,join_date:'2022-07-01',bonus:null},
  {emp_id:3,name:'Meena',department:'Sales',city:'Mysuru',salary:50000,join_date:'2020-01-10',bonus:3000},
  {emp_id:4,name:'Karthik',department:'Sales',city:'Bengaluru',salary:55000,join_date:'2023-02-20',bonus:null},
  {emp_id:5,name:'Priya',department:'HR',city:'Chennai',salary:48000,join_date:'2019-11-05',bonus:2000},
  {emp_id:6,name:'Arjun',department:'Engineering',city:'Bengaluru',salary:120000,join_date:'2018-06-12',bonus:10000},
  {emp_id:7,name:'Sneha',department:'HR',city:'Hyderabad',salary:52000,join_date:'2022-09-30',bonus:null},
  {emp_id:8,name:'Vikram',department:'Sales',city:'Chennai',salary:60000,join_date:'2021-08-18',bonus:4000}
];

function $(s){return document.querySelector(s)}
function $all(s){return Array.from(document.querySelectorAll(s))}

function buildQueryPreview(){
  const cols = $all('.cols input:checked').map(i=>i.dataset.col);
  const distinct = $('#distinct').checked ? 'DISTINCT ' : '';
  const select = cols.length? cols.join(', ') : '*';
  const whereCol = $('#where-col').value;
  const whereOp = $('#where-op').value;
  const whereVal = $('#where-val').value.trim();
  let where = '';
  if(whereCol){
    if(whereOp==='isnull' || whereOp==='isnotnull'){
      where = `WHERE ${whereCol} ${whereOp==='isnull'?'IS NULL':'IS NOT NULL'}`;
    } else if(whereOp==='like'){
      where = `WHERE ${whereCol} LIKE '${whereVal.replace(/'/g,"\\'")}'`;
    } else {
      // try to detect number or quoted text
      const needsQuotes = isNaN(whereVal) && !/^'.*'$/.test(whereVal);
      const val = needsQuotes? `'${whereVal.replace(/'/g,"\\'")}'`: whereVal;
      where = `WHERE ${whereCol} ${whereOp} ${val}`;
    }
  }
  const orderCol = $('#order-col').value;
  const orderDir = $('#order-dir').value;
  const order = orderCol? `ORDER BY ${orderCol} ${orderDir.toUpperCase()}`:'';
  const limit = $('#limit').value? `LIMIT ${$('#limit').value}`:'';
  const sql = `SELECT ${distinct}${select} FROM employees ${where} ${order} ${limit}`.replace(/ +/g,' ').trim();
  $('#sql-preview').textContent = sql;
  return {cols, distinct: $('#distinct').checked, whereCol, whereOp, whereVal, orderCol, orderDir, limit: $('#limit').value};
}

function runQuery(){
  const q = buildQueryPreview();
  let rows = employees.slice();

  // WHERE
  if(q.whereCol){
    rows = rows.filter(r=>{
      const v = r[q.whereCol];
      switch(q.whereOp){
        case '=': return String(v) === stripQuotes(q.whereVal);
        case '!=': return String(v) !== stripQuotes(q.whereVal);
        case '>': return Number(v) > Number(q.whereVal);
        case '<': return Number(v) < Number(q.whereVal);
        case '>=': return Number(v) >= Number(q.whereVal);
        case '<=': return Number(v) <= Number(q.whereVal);
        case 'like': return String(v).toLowerCase().includes(stripQuotes(q.whereVal).toLowerCase().replace(/%/g,''));
        case 'isnull': return v === null || v === undefined;
        case 'isnotnull': return v !== null && v !== undefined;
        default: return true;
      }
    });
  }

  // DISTINCT (simple: by selected columns)
  if(q.distinct){
    const seen = new Set();
    rows = rows.filter(r=>{
      const key = q.cols.map(c=>String(r[c])).join('||');
      if(seen.has(key)) return false; seen.add(key); return true;
    });
  }

  // ORDER BY
  if(q.orderCol){
    rows.sort((a,b)=>{
      const A = a[q.orderCol]; const B = b[q.orderCol];
      if(A==null && B!=null) return 1;
      if(A!=null && B==null) return -1;
      if(typeof A === 'number' && typeof B === 'number') return q.orderDir==='asc'? A-B : B-A;
      return q.orderDir==='asc'? String(A).localeCompare(String(B)) : String(B).localeCompare(String(A));
    });
  }

  // LIMIT
  if(q.limit) rows = rows.slice(0, Number(q.limit));

  // Build table
  const cols = q.cols.length? q.cols : ['emp_id','name','department','city','salary','join_date','bonus'];
  const thead = $('#result-table thead'); const tbody = $('#result-table tbody');
  thead.innerHTML = '<tr>'+cols.map(c=>`<th>${c}</th>`).join('')+'</tr>';
  tbody.innerHTML = rows.map(r=>'<tr class="result-row">'+cols.map(c=>`<td>${renderCell(r[c])}</td>`).join('')+'</tr>').join('');
  $('#result-count').textContent = `${rows.length} row(s)`;

  // animate rows in sequence
  const trList = Array.from(tbody.querySelectorAll('tr.result-row'));
  trList.forEach((tr,i)=>{
    setTimeout(()=> tr.classList.add('show'), i*60);
  });
}

function stripQuotes(s){ if(!s) return s; return s.replace(/^'+|'+$/g,''); }
function renderCell(v){ if(v===null||v===undefined) return '<span style="color:#888">NULL</span>'; return v }

// UI wiring
document.addEventListener('DOMContentLoaded',()=>{
  $all('.cols input, #where-col, #where-op, #where-val, #order-col, #order-dir, #limit, #distinct').forEach(el=>el.addEventListener('change',buildQueryPreview));
  $('#run').addEventListener('click',runQuery);
  $('#reset').addEventListener('click',()=>{ location.reload(); });
  $('#show-sql').addEventListener('click',()=>{ alert($('#sql-preview').textContent); });

  // Challenge clicks
  $all('#challenge-list li').forEach(li=>{
    li.addEventListener('click',()=>{
      const sql = li.dataset.q;
      document.getElementById('challenge-output').innerHTML = `<strong>SQL:</strong><pre>${sql}</pre><button id="apply">Apply to builder</button>`;
      $('#apply').addEventListener('click',()=>{
        applySqlToBuilder(sql);
      });
    });
  });

  buildQueryPreview();
  runQuery();
});

function applySqlToBuilder(sql){
  // Very naive parser for the few challenge forms. Not a full SQL parser.
  sql = sql.replace(/\n/g,' ').replace(/\s+/g,' ').trim();
  // SELECT ... FROM employees WHERE ... ORDER BY ... LIMIT ...
  const sel = sql.match(/SELECT (.+?) FROM/i);
  if(sel){
    const cols = sel[1].trim();
    const distinct = cols.toUpperCase().startsWith('DISTINCT');
    $('#distinct').checked = distinct;
    const colList = cols.replace(/^DISTINCT\s+/i,'').split(',').map(s=>s.trim());
    $all('.cols input').forEach(i=>i.checked = colList.includes(i.dataset.col) || colList.includes('*'));
  }
  const where = sql.match(/WHERE (.+?)(ORDER BY|LIMIT|$)/i);
  if(where){
    const cond = where[1].trim();
    if(/IS NULL/i.test(cond)){
      const col = cond.split('IS')[0].trim(); $('#where-col').value = col; $('#where-op').value='isnull'; $('#where-val').value='';
    } else if(/IS NOT NULL/i.test(cond)){
      const col = cond.split('IS')[0].trim(); $('#where-col').value = col; $('#where-op').value='isnotnull'; $('#where-val').value='';
    } else if(/LIKE/i.test(cond)){
      const m = cond.match(/(\w+)\s+LIKE\s+'(.+)'/i); if(m){$('#where-col').value=m[1];$('#where-op').value='like';$('#where-val').value=m[2];}
    } else {
      const m = cond.match(/(\w+)\s*(=|!=|>=|<=|>|<)\s*('?[^']+'?|\d+)/);
      if(m){$('#where-col').value=m[1];$('#where-op').value=m[2];$('#where-val').value=m[3];}
    }
  } else { $('#where-col').value=''; $('#where-op').value='='; $('#where-val').value=''; }
  const order = sql.match(/ORDER BY (\w+)(?:\s+(ASC|DESC))?/i);
  if(order){ $('#order-col').value=order[1]; $('#order-dir').value=(order[2]||'asc').toLowerCase(); } else { $('#order-col').value=''; }
  const limit = sql.match(/LIMIT (\d+)/i); if(limit) $('#limit').value=limit[1]; else $('#limit').value='';
  buildQueryPreview(); runQuery();
}

// Tooltip for accent stripes
function showTip(accentEl, text){
  // remove existing
  const existing = accentEl.parentElement.querySelector('.tip-bubble');
  if(existing) existing.remove();
  const tip = document.createElement('div');
  tip.className = 'tip-bubble';
  tip.textContent = text;
  // position inside the card near the accent
  const card = accentEl.parentElement;
  card.style.position = 'relative';
  card.appendChild(tip);
  tip.style.left = '12px';
  tip.style.top = (accentEl.offsetTop + 12) + 'px';
  setTimeout(()=> tip.remove(), 5000);
}

// wire accent clicks
document.addEventListener('DOMContentLoaded',()=>{
  $all('.card-accent').forEach(a=>{
    a.style.cursor = 'pointer';
    a.addEventListener('click',()=>{
      const t = a.getAttribute('data-tip') || 'Tip';
      showTip(a,t);
    });
  });
});

// --- Quiz: multiple-choice questions and scoring ---
const quizQuestions = [
  { q: "Does BETWEEN include both end values?", options: ["Yes", "No"], answer: 0, explain: "BETWEEN includes both end values (inclusive)." },
  { q: "Which counts NULL rows?", options: ["COUNT(*)", "COUNT(column)"], answer: 0, explain: "COUNT(*) counts all rows; COUNT(column) ignores NULLs." },
  { q: "Which clause filters groups after aggregation?", options: ["WHERE", "HAVING"], answer: 1, explain: "HAVING filters groups after GROUP BY." },
  { q: "How do you test for NULL in SQL?", options: ["column = NULL", "column IS NULL"], answer: 1, explain: "Use IS NULL (not = NULL)." },
  { q: "What is the logical order SQL processes a query?", options: ["SELECT → WHERE → FROM", "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT", "FROM → SELECT → WHERE"], answer: 1, explain: "Logical order: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT." }
];

function renderQuiz(){
  const root = $('#quiz-container');
  root.innerHTML = quizQuestions.map((qq, i)=>{
    return `<div class="quiz-q"><strong>Q${i+1}.</strong> ${qq.q}<div class="quiz-options">${qq.options.map((opt,idx)=>`<label><input type=\"radio\" name=\"q${i}\" value=\"${idx}\"> ${opt}</label>`).join('')}</div></div>`;
  }).join('');
  $('#quiz-result').innerHTML = '';
}

function gradeQuiz(){
  let score = 0; const details = [];
  quizQuestions.forEach((qq,i)=>{
    const sel = document.querySelector(`input[name=\"q${i}\"]:checked`);
    const chosen = sel ? Number(sel.value) : null;
    const ok = chosen === qq.answer;
    if(ok) score++;
    details.push({q: qq.q, chosen, correct: qq.answer, explain: qq.explain});
  });

  const out = [`<div><strong>Score: ${score} / ${quizQuestions.length}</strong></div>`];
  out.push('<ol>');
  details.forEach((d,i)=>{
    out.push(`<li>`);
    out.push(`<div style="margin-bottom:6px"><strong>Q${i+1}.</strong> ${d.q}</div>`);
    out.push('<div class="quiz-answers">');
    quizQuestions[i].options.forEach((opt, idx)=>{
      const isCorrect = idx === d.correct;
      const isChosen = idx === d.chosen;
      const classes = [isCorrect? 'correct':'', isChosen? 'chosen':''].filter(Boolean).join(' ');
      const label = isChosen? `<strong>Your answer:</strong> ${opt}` : opt;
      out.push(`<div class="ans ${classes}">${label}${isCorrect? ' <em>(Correct)</em>':''}</div>`);
    });
    out.push(`</div><div style="margin-top:6px"><em>${d.explain}</em></div>`);
    out.push('</li>');
  });
  out.push('</ol>');
  $('#quiz-result').innerHTML = out.join('');

  // disable choices so the revealed answers remain
  $all('#quiz-container input[type=radio]').forEach(r=>r.disabled = true);
}

// confetti helper
function triggerConfetti(count=40){
  const colors = ['#ff7ab6','#ffd166','#6bf5d4','#6b28ff','#00c2a8'];
  for(let i=0;i<count;i++){
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random()*100 + 'vw';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    el.style.width = (6+Math.random()*12)+'px';
    el.style.height = (8+Math.random()*18)+'px';
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),2200);
  }
}

// wire quiz buttons
document.addEventListener('DOMContentLoaded',()=>{
  renderQuiz();
  $('#submit-quiz').addEventListener('click',()=>{
    gradeQuiz();
    // celebrate perfect score
    const max = quizQuestions.length; const scored = document.querySelectorAll('#quiz-result strong')[0];
    // after gradeQuiz runs, read score from text
    const txt = scored? scored.textContent : '';
    const m = txt.match(/Score:\s*(\d+)/);
    if(m && Number(m[1])===max) triggerConfetti(60);
  });
  $('#reset-quiz').addEventListener('click',()=>{ renderQuiz(); });
});
