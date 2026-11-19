const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(t._h);t._h=setTimeout(()=>t.style.display='none',2000)};

/* routing */
function route(){const v=(location.hash||'#dashboard').slice(1);
  $$('.view').forEach(e=>e.classList.toggle('active',e.id===v));
  $$('.links a').forEach(a=>a.classList.toggle('active',a.dataset.v===v))}
addEventListener('hashchange',route);route();

/* dropdowns */
$$('[data-menu]').forEach(b=>b.onclick=e=>{e.stopPropagation();const m=$('#'+b.dataset.menu),o=m.classList.contains('open');
  $$('.menu').forEach(x=>x.classList.remove('open'));if(!o)m.classList.add('open')});
document.onclick=()=>{$$('.menu').forEach(x=>x.classList.remove('open'));$('#sres').style.display='none'};

/* global search */
const items=[['دورة','Web Application Security','#paths'],['دورة','Network Traffic Analysis','#paths'],['دورة','Applied Cryptography','#paths'],['معمل','LAB-042 Secure Login Review','#lab'],['معمل','PCAP-05 Packet Analysis','#lab'],['ثغرة','CVE-2024-6387 OpenSSH','#dashboard'],['ثغرة','CVE-2024-3094 XZ Utils','#dashboard']];
$('#gs').oninput=e=>{const q=e.target.value.toLowerCase(),r=$('#sres');
  const m=q?items.filter(i=>i[1].toLowerCase().includes(q)):[];
  r.innerHTML=m.map(i=>`<a href="${i[2]}"><span>${i[1]}</span><span class="mut">${i[0]}</span></a>`).join('');
  r.style.display=m.length?'block':'none'};
$('#gs').onclick=e=>e.stopPropagation();

/* radar */
(function(){const ax=[['Web Security',85],['Network Analysis',64],['Cryptography',40],['Reverse Engineering',55]],S=300,c=S/2,R=100;
  const pt=(i,v)=>{const a=-Math.PI/2+i*2*Math.PI/ax.length;return[c+Math.cos(a)*R*v/100,c+Math.sin(a)*R*v/100]};
  let s=`<svg width="${S+80}" height="${S}" viewBox="-40 0 ${S+80} ${S}">`;
  [25,50,75,100].forEach(l=>s+=`<polygon points="${ax.map((_,i)=>pt(i,l).join(',')).join(' ')}" fill="none" stroke="#243049"/>`);
  ax.forEach((a,i)=>{const p=pt(i,100),q=pt(i,122);s+=`<line x1="${c}" y1="${c}" x2="${p[0]}" y2="${p[1]}" stroke="#243049"/><text x="${q[0]}" y="${q[1]}" fill="#d7e2f5" font-size="12" text-anchor="middle">${a[0]} ${a[1]}%</text>`});
  s+=`<polygon points="${ax.map((a,i)=>pt(i,a[1]).join(',')).join(' ')}" fill="rgba(0,255,157,.25)" stroke="#00ff9d" stroke-width="2"/></svg>`;
  $('#radar').innerHTML=s})();

/* lab */
const FLAG='CTF{parameterized_queries_win}';let on=false,secs=3600,tmr,hints=0;
const term=$('#term');
function out(t,c){const d=document.createElement('div');if(c)d.className=c;d.textContent=t;term.appendChild(d)}
function prompt_(){const l=document.createElement('div');l.className='tl';l.innerHTML='<span class="pr">student@lab:~$</span><input autofocus spellcheck="false">';term.appendChild(l);
  const i=$('input',l);i.focus();i.onkeydown=e=>{if(e.key!=='Enter')return;const cmd=i.value.trim();i.disabled=true;run(cmd);prompt_();term.scrollTop=1e9}}
term.onclick=()=>{const i=$$('input',term).pop();i&&i.focus()};
function run(c){if(!c)return;
  if(!on)return out('Instance is not running. Start the instance first.','err');
  const [cmd]=c.split(' ');
  const R={help:'Commands: help, ping, scan, ls, cat <file>, clear',
    ping:'64 bytes from 10.10.4.23: icmp_seq=1 ttl=63 time=0.8 ms',
    scan:'PORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http',
    ls:'flag.txt  notes.md'};
  if(cmd==='clear')return term.innerHTML='';
  if(cmd==='cat'){const f=c.split(' ')[1];
    if(f==='flag.txt'){mark(3);return out(FLAG)} if(f==='notes.md')return out('Fix: use parameterized queries.');
    return out('cat: file not found','err')}
  if(cmd==='ping')mark(0);if(cmd==='scan')mark(1);
  out(R[cmd]||`${cmd}: command not found`,R[cmd]?'':'err')}
function mark(i){$$('#steps li')[i].classList.add('done')}
out('CyberLearn sandbox terminal. Type "help".');prompt_();

const fmt=s=>new Date(s*1e3).toISOString().substr(11,8);
function setState(o){on=o;const b=$('#pw'),s=$('#ist');
  if(o){b.textContent='■ Stop Instance';b.className='btn btn-d btn-sm';s.className='st on';s.textContent='Connected';$('#tip').textContent='10.10.4.23';$('#burl').textContent='http://10.10.4.23/login';mark(0);
    tmr=setInterval(()=>{secs--;$('#timer').textContent=fmt(secs);if(secs<=0)setState(false)},1e3);$('#timer').textContent=fmt(secs);out('Instance started. Target: 10.10.4.23')}
  else{clearInterval(tmr);b.textContent='▶ Start Instance';b.className='btn btn-p btn-sm';s.className='st off';s.textContent='Offline';$('#tip').textContent='—';$('#burl').textContent='http://— (البيئة متوقفة)';out('Instance stopped.')}}
$('#pw').onclick=()=>setState(!on);
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.toggle('active',x===b));$$('.pane').forEach(p=>p.classList.toggle('active',p.id===b.dataset.t))});
$('#blogin').onclick=()=>{$('#bmsg').textContent=on?'Invalid credentials (simulated page).':'البيئة متوقفة.';mark(2)};
$('#fsub').onclick=()=>{const m=$('#fmsg'),ok=$('#flag').value.trim()===FLAG;
  m.textContent=ok?'✅ صحيح! +350 XP':'❌ راية غير صحيحة';m.style.color=ok?'var(--neon)':'var(--red)'};
const H=['تلميح 1: افحص الملفات في مجلد المستخدم عبر ls.','تلميح 2: اقرأ ملف flag.txt بالأمر cat.'];
$('#hint').onclick=()=>{$('#hbox').innerHTML=H.slice(0,Math.min(++hints,H.length)).join('<br>')};
$('#sol').onclick=()=>{if(confirm('إظهار الحل قد يخصم نقاطاً. متابعة؟'))$('#hbox').innerHTML='الحل: ping ← scan ← ls ← cat flag.txt'};

/* topology */
(function(){const n=[['Student',80,150,'on'],['Gateway',230,150,'on'],['Web Server',400,70,'on'],['DB Server',400,150,'on'],['Monitor',400,230,'off']];
  let s='';[[0,1],[1,2],[1,3],[1,4]].forEach(([a,b])=>s+=`<line x1="${n[a][1]}" y1="${n[a][2]}" x2="${n[b][1]}" y2="${n[b][2]}" stroke="#00d4ff" stroke-width="2" opacity=".6"/>`);
  n.forEach(x=>{const c=x[3]==='on'?'#00ff9d':'#8a94a6';s+=`<circle cx="${x[1]}" cy="${x[2]}" r="22" fill="#0c1220" stroke="${c}" stroke-width="3"/><text x="${x[1]}" y="${x[2]+42}" fill="#d7e2f5" font-size="12" text-anchor="middle">${x[0]}</text>`});
  $('#topo').innerHTML=s})();

/* code snippets */
document.addEventListener('click',e=>{const t=e.target,c=t.closest('.code');if(!c)return;
  if(t.dataset.copy!==undefined){navigator.clipboard.writeText($('pre',c).textContent);toast('تم النسخ ✔')}
  if(t.dataset.zoom!==undefined){c.classList.toggle('big');t.textContent=c.classList.contains('big')?'تصغير':'تكبير'}});

/* paths */
const mods=[['Introduction to SOC & Monitoring','completed','45 د',1,2,1],['Log Analysis Fundamentals','completed','90 د',1,3,1],['SIEM in Practice','available','2 س',1,4,1],['Incident Response','locked','3 س',1,3,1],['Threat Hunting','locked','4 س',1,5,1]];
$('#tree').innerHTML=mods.map((m,i)=>`<div class="node ${m[1]}"><div class="dot">${{completed:'✓',available:'▶',locked:'🔒'}[m[1]]}</div><div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><h2 style="margin:0">Module ${i+1}: ${m[0]}</h2><span class="st ${m[1]==='locked'?'off':'on'}">${{completed:'Completed',available:'Available',locked:'Locked'}[m[1]]}</span></div><div class="meta"><span>📖 ${m[3]*4} دروس (نص/فيديو)</span><span>🧪 ${m[4]} معامل</span><span>📝 اختبار نهائي</span><span>⏱ ${m[2]}</span></div></div></div>`).join('');

/* leaderboard */
const D={w:[['Sara_M',2450,'🥇🛡🔥',92],['Omar_77',2210,'🥈🛡',88],['Ahmed_K',1980,'🛡🔥',81],['Nour_H',1750,'🥉',76],['Lina_Z',1500,'🛡',70]],
  m:[['Omar_77',9800,'🥇🛡🔥',90],['Sara_M',9400,'🥈🛡',94],['Nour_H',8100,'🥉🔥',80],['Ahmed_K',7400,'🛡',79],['Lina_Z',6900,'🛡',72]],
  a:[['Ahmed_K',12450,'🥇🛡🔥⭐',85],['Sara_M',12100,'🥈🛡🔥',93],['Omar_77',11800,'🥉🛡',89],['Nour_H',10500,'🛡',82],['Lina_Z',9900,'🔥',74]]};
const cols=['#00ff9d','#00d4ff','#a855f7','#ffc400','#ff2d55'];
function lb(p){$('#lbt').innerHTML=D[p].map((r,i)=>`<tr class="${r[0]==='Ahmed_K'?'me':''}"><td>${i+1}</td><td><div class="u"><b style="background:${cols[i]}">${r[0][0]}</b>${r[0]}</div></td><td class="mono">${r[1].toLocaleString()}</td><td>${r[2]}</td><td><div class="bar" style="width:100px"><i style="width:${r[3]}%"></i></div>${r[3]}%</td></tr>`).join('')}
lb('w');$$('#lbf button').forEach(b=>b.onclick=()=>{$$('#lbf button').forEach(x=>x.classList.toggle('active',x===b));lb(b.dataset.p)});
$$('.spoil').forEach(s=>s.onclick=()=>s.classList.toggle('show'));
