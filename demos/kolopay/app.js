const cats=[{id:'c1',n:'Électroménager',e:'❄️'},{id:'c2',n:'Téléphones',e:'📱'},{id:'c3',n:'Motos',e:'🏍️'},{id:'c4',n:'Électronique',e:'📺'},{id:'c5',n:'Groupes Électrogènes',e:'⚡'}];
const shops={m1:'Congo Electra',m2:'TechStore Kin',m3:'Moto Plus KIN',m4:'Gen Power RDC'};
const prods=[
{id:'p1',mid:'m1',cat:'c1',nom:'Congélateur 200L',desc:'Congélateur horizontal 200 litres',prix:450,emoji:'🧊',max:180},
{id:'p2',mid:'m1',cat:'c1',nom:'Cuisinière 4 feux',desc:'Cuisinière à gaz 4 feux avec four',prix:320,emoji:'🔥',max:120},
{id:'p3',mid:'m1',cat:'c1',nom:'Réfrigérateur 350L',desc:'Réfrigérateur combiné 350 litres No Frost',prix:580,emoji:'❄️',max:365},
{id:'p4',mid:'m2',cat:'c2',nom:'Tecno Camon 30',desc:'Smartphone 8GB RAM, 256GB, 5000mAh',prix:180,emoji:'📱',max:90},
{id:'p5',mid:'m2',cat:'c2',nom:'Samsung A15',desc:'Samsung Galaxy A15, 4GB RAM, 128GB',prix:220,emoji:'📱',max:90},
{id:'p6',mid:'m2',cat:'c4',nom:'TV LED 43 pouces',desc:'Téléviseur LED 43 pouces Full HD',prix:280,emoji:'📺',max:120},
{id:'p7',mid:'m3',cat:'c3',nom:'Moto Bajaj Boxer 150',desc:'Moto Bajaj Boxer 150cc, neuve',prix:1200,emoji:'🏍️',max:365},
{id:'p8',mid:'m3',cat:'c3',nom:'Moto Jialing 125',desc:'Moto Jialing 125cc, neuve',prix:850,emoji:'🏍️',max:365},
{id:'p9',mid:'m4',cat:'c5',nom:'Groupe Électrogène 2.5kW',desc:'Générateur essence 2500W',prix:380,emoji:'⚡',max:180},
{id:'p10',mid:'m4',cat:'c5',nom:'Groupe Électrogène 5kW',desc:'Générateur essence 5000W',prix:650,emoji:'⚡',max:365}
];
const rate=2800;
let plans=[],notifs=[],selCat=null,curProd=null,curPlan=null,freq='quotidien',duree=30,momo='mpesa';

function renderChips(){
  document.getElementById('chips').innerHTML='<div class="chip '+(selCat===null?'act':'')+'" onclick="selCat=null;renderChips();renderGrid()">Tout</div>'+cats.map(c=>'<div class="chip '+(selCat===c.id?'act':'')+'" onclick="selCat=\''+c.id+'\';renderChips();renderGrid()">'+c.e+' '+c.n+'</div>').join('');
}

function renderGrid(){
  let f=prods;if(selCat)f=f.filter(p=>p.cat===selCat);
  const q=document.getElementById('search').value.toLowerCase();if(q)f=f.filter(p=>p.nom.toLowerCase().includes(q));
  document.getElementById('grid').innerHTML=f.map(p=>{
    const d=p.prix/30;const ds=d<1?d.toFixed(1):d.toFixed(0);
    return '<div class="card" onclick="openDetail(\''+p.id+'\')"><div class="card-img">'+p.emoji+'</div><div class="card-body"><h3>'+p.nom+'</h3><div class="card-price">'+p.prix+' $</div><div class="card-sub">dès '+ds+' $/jour</div></div></div>';
  }).join('');
}

function filterSearch(){renderGrid()}

function calcV(){const p=curProd;if(freq==='quotidien')return p.prix/duree;if(freq==='hebdomadaire')return p.prix/(duree/7);return p.prix/(duree/30)}
function calcN(){if(freq==='quotidien')return duree;if(freq==='hebdomadaire')return Math.round(duree/7);return Math.round(duree/30)}

function openDetail(id){
  curProd=prods.find(p=>p.id===id);if(!curProd)return;
  freq='quotidien';duree=30;renderDetail();
  document.getElementById('overlay').classList.add('show');
}
function closeDetail(){document.getElementById('overlay').classList.remove('show')}
function setFreq(f){freq=f;renderDetail()}
function setDuree(v){duree=parseInt(v);renderDetail()}

function renderDetail(){
  const p=curProd;const v=calcV();const n=calcN();
  document.getElementById('detailBody').innerHTML=
    '<div class="p-img">'+p.emoji+'</div>'+
    '<div class="p-title">'+p.nom+'</div>'+
    '<div class="p-price">'+p.prix+' $</div>'+
    '<div class="p-cdf">~'+(p.prix*rate).toLocaleString()+' CDF</div>'+
    '<div class="p-desc">'+p.desc+'</div>'+
    '<div class="p-shop">📍 '+shops[p.mid]+'</div>'+
    '<div class="calc-box">'+
    '<h3>Calculez votre plan</h3>'+
    '<div class="calc-label">Fréquence de paiement</div>'+
    '<div class="freq-chips">'+
    '<div class="freq-chip '+(freq==='quotidien'?'act':'')+'" onclick="setFreq(\'quotidien\')">Quotidien</div>'+
    '<div class="freq-chip '+(freq==='hebdomadaire'?'act':'')+'" onclick="setFreq(\'hebdomadaire\')">Hebdomadaire</div>'+
    '<div class="freq-chip '+(freq==='mensuel'?'act':'')+'" onclick="setFreq(\'mensuel\')">Mensuel</div>'+
    '</div>'+
    '<div class="calc-label">Durée: '+duree+' jours</div>'+
    '<input type="range" min="7" max="'+p.max+'" value="'+duree+'" oninput="setDuree(this.value)" style="width:100%;accent-color:#1B5E20">'+
    '<div class="recap">'+
    '<div class="recap-row"><span>Versement</span><span class="green">'+v.toFixed(2)+' $</span></div>'+
    '<div class="recap-row"><span>Nombre de versements</span><strong>'+n+'</strong></div>'+
    '<div class="recap-row"><span>Total à payer</span><strong>'+p.prix+' $</strong></div>'+
    '</div></div>'+
    '<button class="cta-btn" onclick="startPlan()">Commencer à épargner</button>'+
    '<div class="info-box"><span>💡 Vous ne recevez l\'article qu\'après avoir payé la totalité. Zéro dette, zéro intérêt.</span></div>';
}

function startPlan(){
  const p=curProd;const v=calcV();const n=calcN();
  curPlan={id:'plan_'+Date.now(),prodId:p.id,prodNom:p.nom,emoji:p.emoji,merchant:shops[p.mid],total:p.prix,paye:0,freq:freq,versement:v,nbPrevus:n,nbPayes:0,statut:'actif'};
  closeDetail();
  showPay();
}

function showPay(){
  const p=curPlan;
  const reste=p.total-p.paye;
  const pct=p.total>0?(p.paye/p.total*100):0;
  document.getElementById('payBody').innerHTML=
    '<div class="prog-card">'+
    '<div style="font-size:16px;font-weight:bold;text-align:center">'+p.prodNom+'</div>'+
    '<div class="prog-bar"><div class="prog-fill" style="width:'+pct+'%"></div></div>'+
    '<div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:#1B5E20;font-weight:600">'+p.paye.toFixed(0)+' $ payé</span><span style="color:#757575">'+reste.toFixed(0)+' $ restant</span></div>'+
    '<div style="text-align:center;font-size:13px;font-weight:700;color:#1B5E20;margin-top:4px">'+pct.toFixed(1)+'% complété</div>'+
    '</div>'+
    '<div class="pay-section"><label>Montant du versement</label><input type="number" class="amount-input" id="amtInput" value="'+p.versement.toFixed(2)+'"></div>'+
    '<div class="pay-section"><label>Méthode de paiement</label>'+
    '<div class="momo-item '+(momo==='mpesa'?'sel':'')+'" onclick="momo=\'mpesa\';showPay()"><div class="momo-icon" style="background:#D32F2F">M</div><span>M-Pesa (Vodacom)</span></div>'+
    '<div class="momo-item '+(momo==='airtel'?'sel':'')+'" onclick="momo=\'airtel\';showPay()"><div class="momo-icon" style="background:#ED1C24">A</div><span>Airtel Money</span></div>'+
    '<div class="momo-item '+(momo==='orange'?'sel':'')+'" onclick="momo=\'orange\';showPay()"><div class="momo-icon" style="background:#FF6600">O</div><span>Orange Money</span></div>'+
    '</div>'+
    '<button class="pay-btn" onclick="doPay()">Payer</button>';
  document.getElementById('payScreen').classList.add('show');
}

function closePay(){document.getElementById('payScreen').classList.remove('show')}

function doPay(){
  const amt=parseFloat(document.getElementById('amtInput').value)||0;
  const p=curPlan;
  p.paye=Math.min(p.paye+amt,p.total);
  p.nbPayes++;
  const reste=p.total-p.paye;
  const complete=p.paye>=p.total;
  if(complete)p.statut='complete';
  const exists=plans.find(pl=>pl.id===p.id);
  if(exists){Object.assign(exists,p)}else{plans.push({...p})}
  notifs.unshift({type:complete?'complete':'pay',titre:complete?'Paiement complet!':'Versement reçu',msg:complete?'Félicitations! Récupérez votre article chez '+p.merchant:'Versement de '+amt+' USD reçu. Total: '+p.paye.toFixed(0)+' / '+p.total+' USD',time:new Date()});
  closePay();
  showSuccess(complete,p);
}

function showSuccess(complete,p){
  document.getElementById('sIcon').className='s-icon '+(complete?'complete':'partial');
  document.getElementById('sIcon').innerHTML=complete?'🎉':'✓';
  document.getElementById('sTitle').textContent=complete?'Paiement complet!':'Versement réussi!';
  document.getElementById('sMsg').textContent=complete?'Félicitations! Vous avez fini de payer. Récupérez votre article chez '+p.merchant:'Vous avez payé '+p.paye.toFixed(0)+' $ sur '+p.total+' $';
  document.getElementById('successScreen').classList.add('show');
}

function closeAll(){
  document.getElementById('successScreen').classList.remove('show');
  document.getElementById('payScreen').classList.remove('show');
  nav('market');
}

function nav(tab){
  document.querySelectorAll('.alt-screen').forEach(s=>s.classList.remove('show'));
  document.getElementById('payScreen').classList.remove('show');
  document.getElementById('successScreen').classList.remove('show');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('act'));
  if(tab==='market'){
    document.querySelector('[data-nav="market"]').classList.add('act');
  }else if(tab==='plans'){
    document.querySelector('[data-nav="plans"]').classList.add('act');
    document.getElementById('plansScreen').classList.add('show');
    renderPlans();
  }else if(tab==='notifs'){
    document.querySelector('[data-nav="notifs"]').classList.add('act');
    document.getElementById('notifsScreen').classList.add('show');
    renderNotifs();
  }else if(tab==='profile'){
    document.querySelector('[data-nav="profile"]').classList.add('act');
    document.getElementById('profileScreen').classList.add('show');
  }
}

function renderPlans(){
  const body=document.getElementById('plansBody');
  if(plans.length===0){
    body.innerHTML='<div class="empty-state"><h3>Aucun plan actif</h3><p>Allez dans la boutique pour commencer à épargner</p></div>';
    return;
  }
  body.innerHTML=plans.map(p=>{
    const reste=p.total-p.paye;
    const pct=p.total>0?(p.paye/p.total*100):0;
    const complete=p.statut==='complete';
    return '<div class="plan-card"><div class="plan-header"><h3>'+p.emoji+' '+p.prodNom+'</h3><div class="plan-badge '+(complete?'complete':'active')+'">'+(complete?'Complet':pct.toFixed(0)+'%')+'</div></div><div style="font-size:12px;color:#757575">'+p.merchant+'</div><div class="plan-prog"><div class="plan-prog-fill" style="width:'+pct+'%"></div></div><div class="plan-stats"><span>'+p.paye.toFixed(0)+' $ / '+p.total+' $</span><span class="grey">Reste: '+reste.toFixed(0)+' $</span></div><div style="font-size:12px;color:#757575;margin-top:4px">'+p.nbPayes+'/'+p.nbPrevus+' versements</div>'+(complete?'<div class="complete-badge" style="background:rgba(46,125,50,0.08);border-radius:8px;padding:10px;margin-top:12px"><span style="font-size:12px;color:#2E7D32;font-weight:600">✓ Récupérez votre article chez '+p.merchant+'</span></div>':'<button class="plan-cta" onclick="curPlan=plans.find(pl=>pl.id==\''+p.id+'\');showPay()">Faire un versement</button>')+'</div>';
  }).join('');
}

function renderNotifs(){
  const body=document.getElementById('notifsBody');
  if(notifs.length===0){
    body.innerHTML='<div class="empty-state"><h3>Aucune notification</h3></div>';return;
  }
  body.innerHTML=notifs.map(n=>'<div class="notif-item"><div class="notif-icon '+(n.type==='complete'?'complete':'pay')+'">'+(n.type==='complete'?'🎉':'✓')+'</div><div class="notif-content"><h4>'+n.titre+'</h4><p>'+n.msg+'</p><time>'+n.time.toLocaleString()+'</time></div></div>').join('');
}

renderChips();renderGrid();
