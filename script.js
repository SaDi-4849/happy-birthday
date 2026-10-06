const screens=[...document.querySelectorAll('.screen')];
const state=JSON.parse(localStorage.getItem('happy-birthday-memory-v2')||'null')||{good:[],songs:[],learned:[],remember:[]};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function go(id){screens.forEach(s=>s.classList.toggle('active',s.id===id));window.scrollTo(0,0);if(id==='summary')buildSummary()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(b.dataset.go)});
function save(){localStorage.setItem('happy-birthday-memory-v2',JSON.stringify(state))}
function render(key){
 const box=document.querySelector(`[data-list="${key}"]`);box.innerHTML='';
 (state[key].length?state[key]:['']).forEach((v,i)=>{
  const row=document.createElement('div');row.className='entry';
  row.innerHTML=`<input value="${esc(v)}" placeholder="${key==='songs'?'song title':'write something...'}"><button class="remove" title="remove">×</button>`;
  row.querySelector('input').addEventListener('input',e=>{state[key][i]=e.target.value;save()});
  row.querySelector('.remove').addEventListener('click',()=>{state[key].splice(i,1);save();render(key)});
  box.appendChild(row);
 });
}
['good','songs','learned','remember'].forEach(render);
document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{state[b.dataset.add].push('');save();render(b.dataset.add);const inputs=document.querySelectorAll(`[data-list="${b.dataset.add}"] input`);inputs[inputs.length-1]?.focus()});
function clean(a){return a.filter(x=>x.trim())}
function buildSummary(){
 const labels={good:'Good things that happened',songs:'Songs of this year',learned:'Things I learned',remember:'Things I want to remember'};
 let html=`<h3>a little archive</h3><div class="summary-meta">made for keeping</div>`;
 for(const k of Object.keys(labels)){const arr=clean(state[k]);html+=`<div class="summary-block"><h4>${labels[k]}</h4>${arr.length?arr.map(x=>`<p>• ${esc(x)}</p>`).join(''):'<p>nothing written here.</p>'}</div>`}
 html+=`<div class="summary-block"><h4>one last thing</h4><p>امیدوارم سال جدید زندگیت پر از اتفاق‌های خوب، آدم‌های خوب و کلی خاطره‌ی جدید باشه.</p></div>`;
 document.getElementById('summaryPreview').innerHTML=html;
}
document.getElementById('summaryButton').onclick=()=>go('summary');
document.getElementById('printPdf').onclick=()=>{buildSummary();window.print()};
document.getElementById('saveTxt').onclick=()=>{
 let out='A LITTLE ARCHIVE\n\n';
 const labels={good:'GOOD THINGS THAT HAPPENED',songs:'SONGS OF THIS YEAR',learned:'THINGS I LEARNED',remember:'THINGS I WANT TO REMEMBER'};
 for(const k of Object.keys(labels)){out+=labels[k]+'\n'+(clean(state[k]).map(x=>'• '+x).join('\n')||'—')+'\n\n'}
 out+='ONE LAST THING\n'+`امیدوارم سال جدید زندگیت پر از اتفاق‌های خوب، آدم‌های خوب و کلی خاطره‌ی جدید باشه.`;
 const blob=new Blob([out],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='a-little-archive.txt';a.click();URL.revokeObjectURL(a.href)
};
const modal=document.getElementById('eggModal');document.getElementById('egg').onclick=()=>modal.classList.add('show');document.getElementById('closeEgg').onclick=()=>modal.classList.remove('show');modal.onclick=e=>{if(e.target===modal)modal.classList.remove('show')};
