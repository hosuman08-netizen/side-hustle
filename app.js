
(function(){
  var K='shl_v1';
  function load(){try{return JSON.parse(localStorage.getItem(K)||'{"rows":[]}');}catch(e){return{rows:[]};}}
  function save(s){localStorage.setItem(K,JSON.stringify(s));}
  var s=load(); var root=document.getElementById('app');
  function sum(){return s.rows.reduce(function(a,b){return a+(+b.won||0);},0);}
  function hours(){return s.rows.reduce(function(a,b){return a+(+b.hrs||0);},0);}
  function render(){
    var t=sum(), h=hours(), rate=h?Math.round(t/h):0; try{var br=+(localStorage.getItem('shl_best')||0); if(rate>br){localStorage.setItem('shl_best',rate);br=rate;} }catch(e){var br=rate;}
    root.innerHTML='<div class="card"><span class="chip">총수입 <b>'+t.toLocaleString()+'</b></span> <span class="chip">시간 <b>'+h+'</b>h</span> <span class="chip">시급환산 <b>'+rate.toLocaleString()+'</b></span> <span class="chip">최고 <b>'+(br||rate).toLocaleString()+'</b></span></div>'
      +'<div class="card"><input id="job" placeholder="부업명"/><input id="won" type="number" placeholder="수입(원)"/><input id="hrs" type="number" step="0.5" placeholder="시간"/><button id="add">기록</button></div>'
      +'<div class="card" id="list"></div>';
    document.getElementById('list').innerHTML=s.rows.slice().reverse().slice(0,15).map(function(r){
      return '<div style="padding:6px 0;border-bottom:1px solid #2a2438">'+r.job+' · '+r.won.toLocaleString()+'원 · '+r.hrs+'h</div>';
    }).join('')||'<span class="sub">기록 없음</span>';
    if(!document.getElementById('shareSum')){
      var b=document.createElement('button'); b.id='shareSum'; b.style.cssText='width:100%;margin-top:8px;padding:11px;border:0;border-radius:10px;background:#1c1826;color:#ece8f1;font-weight:700';
      b.textContent='요약 공유'; b.onclick=function(){var text='부업 '+sum().toLocaleString()+'원 / '+hours()+'h · https://hosuman08-netizen.github.io/side-hustle/';
        if(navigator.clipboard)navigator.clipboard.writeText(text);try{legionTrack('share_peak',{})}catch(e){}};
      root.appendChild(b);
    }
    document.getElementById('add').onclick=function(){
      s.rows.push({job:document.getElementById('job').value||'부업',won:+document.getElementById('won').value||0,hrs:+document.getElementById('hrs').value||0,t:Date.now()});
      save(s);render();try{legionTrack('activate',{})}catch(e){}
    };
  }
  try{legionTrack('session_start',{})}catch(e){}
  render();
})();
