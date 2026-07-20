(function(){
  var K='shl_v1';
  var SHARE_BASE='https://hosuman08-netizen.github.io/side-hustle/';
  function load(){try{return JSON.parse(localStorage.getItem(K)||'{"rows":[]}');}catch(e){return{rows:[]};}}
  function save(s){localStorage.setItem(K,JSON.stringify(s));}
  function monthTotal(s){return (s.rows||[]).reduce(function(a,b){return a+(+b.amt||0);},0);}
  function dayKey(off){
    var d=new Date(); d.setDate(d.getDate()+(off||0));
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function kId(){
    try{
      var id=localStorage.getItem('shl_k_id');
      if(!id){id='s'+Math.random().toString(36).slice(2,8);localStorage.setItem('shl_k_id',id);}
      return id;
    }catch(e){return 'share';}
  }
  function shareUrl(){return SHARE_BASE+'?utm_source=share&utm_medium=app&ref='+encodeURIComponent(kId());}
  function bumpStreak(){
    try{
      var st=JSON.parse(localStorage.getItem('shl_streak')||'{}');
      if(!st||typeof st!=='object')st={last:null,count:0};
      var t=dayKey(0);
      if(st.last===t) return st;
      var y=dayKey(-1),y2=dayKey(-2),froze=false;
      if(st.last && st.last!==y && st.last===y2 && (st.count||0)>=3){
        var ready=!st.shieldLast||((new Date(t)-new Date(st.shieldLast))/86400000)>=7;
        if(ready){st.shieldLast=t;st.last=y;froze=true;try{legionTrack('streak_freeze',{count:st.count})}catch(e){}}
      }
      st.count=(st.last===y)?(st.count||0)+1:1;
      st.last=t;
      localStorage.setItem('shl_streak',JSON.stringify(st));
      try{legionTrack('streak',{count:st.count,froze:froze})}catch(e){}
      return st;
    }catch(e){return {count:0};}
  }
  var s=load(); var root=document.getElementById('app');
  function sum(){return s.rows.reduce(function(a,b){return a+(+b.won||0);},0);}
  function hours(){return s.rows.reduce(function(a,b){return a+(+b.hrs||0);},0);}
  function fomoLeft(){
    var end=new Date(); end.setHours(24,0,0,0);
    var ms=Math.max(0,end-Date.now());
    return Math.floor(ms/3600000)+'h '+Math.floor((ms%3600000)/60000)+'m';
  }
  function weekSum(){
    var cut=Date.now()-7*864e5;
    return s.rows.reduce(function(a,r){return a+((r.t||0)>=cut?(+r.won||0):0);},0);
  }
  function byJob(){
    var m={};
    s.rows.forEach(function(r){var j=r.job||'기타'; m[j]=(m[j]||0)+(+r.won||0);});
    return Object.keys(m).map(function(k){return{j:k,a:m[k]};}).sort(function(a,b){return b.a-a.a;});
  }
  function render(){
    var t=sum(), h=hours(), rate=h?Math.round(t/h):0;
    try{var br=+(localStorage.getItem('shl_best')||0); if(rate>br){localStorage.setItem('shl_best',rate);br=rate;} }catch(e){var br=rate;}
    var st=JSON.parse(localStorage.getItem('shl_streak')||'{}');
    var sc=st.count||0;
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast))/86400000)>=7;
    var goal=+(localStorage.getItem('shl_goal')||500000);
    var gPct=goal?Math.min(100,Math.round(t/goal*100)):0;
    var ws=weekSum();
    root.innerHTML='<div class="card" style="font-size:11px;color:#67e8f9">투명 금융 · 로컬 장부 · 투자권유 아님</div>'
      +'<div class="card"><span class="chip">총수입 <b>'+t.toLocaleString()+'</b></span> <span class="chip">7일 <b>'+ws.toLocaleString()+'</b></span> <span class="chip">건수 <b>'+s.rows.length+'</b></span> <span class="chip">시간 <b>'+h+'</b>h</span> <span class="chip">시급 <b>'+rate.toLocaleString()+'</b></span> <span class="chip">최고 <b>'+(br||rate).toLocaleString()+'</b></span> <span class="chip">목표 <b>'+gPct+'%</b></span> <span class="chip">🔥 '+sc+'일'+(sc>=3&&ready?' · 🛡️':'')+'</span> <span class="chip">리셋 '+fomoLeft()+'</span>'
      +'<div class="bar" style="height:6px;background:#2a2438;border-radius:4px;margin-top:8px;overflow:hidden"><i style="display:block;height:100%;width:'+gPct+'%;background:'+(gPct>=100?'#4ade80':'#67e8f9')+'"></i></div></div>'
      +'<div class="card"><label class="sub">월 목표(원)</label><input id="goal" type="number" value="'+goal+'"/><button class="sec" id="setGoal">목표 저장</button>'
      +'<input id="job" placeholder="부업명"/><input id="won" type="number" placeholder="수입(원)"/><input id="hrs" type="number" step="0.5" placeholder="시간"/><button class="sec" data-q="배달|35000">배달 35k</button><button class="sec" data-q="원고|50000">원고 50k</button><button id="add">기록</button>'
      +'<button class="sec" id="undo" style="margin-top:6px">↩ 직전 취소</button></div>'
      +'<div class="card" id="jobBox"><b>부업별</b><div id="jobs" class="sub" style="margin-top:6px"></div></div>'
      +'<div class="card" id="list"></div>'
      +'<div class="card" id="moneyPipe" style="text-align:center;font-size:12px">'
      +'<div style="color:#67e8f9;font-weight:700;margin-bottom:6px">💎 투명 루프</div>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/budget-pulse/?utm_source=sidehustle&utm_medium=pipe">💓 Budget</a>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/cost-basis/?utm_source=sidehustle&utm_medium=pipe">🧮 Cost Basis</a>'
      +'<a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=sidehustle&utm_medium=pipe">🎮 Arcade</a>'
      +'</div>'
      +'<button id="shareSum" style="width:100%;margin-top:8px;padding:11px;border:0;border-radius:10px;background:#1c1826;color:#ece8f1;font-weight:700">요약 공유</button>';
    var jb=document.getElementById('jobs');
    if(jb){
      var tops=byJob().slice(0,6);
      jb.innerHTML=tops.length?tops.map(function(x){
        var p=t?Math.round(x.a/t*100):0;
        return '<div style="display:flex;justify-content:space-between;padding:3px 0"><span>'+x.j+'</span><b>'+x.a.toLocaleString()+' ('+p+'%)</b></div>';
      }).join(''):'기록 후 자동 집계';
    }
    if(!s.rows.length){
      document.getElementById('list').innerHTML='<div class="sub">기록 없음 — 첫 부업을 적으면 시급이 계산됩니다.<br><button id="emptySample" style="margin-top:8px">예시 배달 35000 / 3h</button></div>';
      var es=document.getElementById('emptySample');
      if(es) es.onclick=function(){s.rows.push({job:'배달',won:35000,hrs:3,t:Date.now()});save(s);bumpStreak();render();try{legionTrack('activate',{sample:1})}catch(e){}};
    }else{
      document.getElementById('list').innerHTML=s.rows.slice().reverse().slice(0,15).map(function(r,idx){
        var real=s.rows.length-1-idx;
        return '<div data-del="'+real+'" style="padding:6px 0;border-bottom:1px solid #2a2438;cursor:pointer">'+r.job+' · '+r.won.toLocaleString()+'원 · '+r.hrs+'h <small style="opacity:.5">탭삭제</small></div>';
      }).join('');
      Array.prototype.forEach.call(document.querySelectorAll('[data-del]'),function(row){
        row.onclick=function(){s.rows.splice(+row.getAttribute('data-del'),1);save(s);render();try{legionTrack('del',{})}catch(e){}};
      });
    }
    var sg=document.getElementById('setGoal');
    if(sg) sg.onclick=function(){localStorage.setItem('shl_goal',String(+document.getElementById('goal').value||500000));render();try{legionTrack('goal',{})}catch(e){}};
    var ub=document.getElementById('undo');
    if(ub) ub.onclick=function(){if(!s.rows.length)return;s.rows.pop();save(s);render();try{legionTrack('undo',{})}catch(e){}};
    document.getElementById('shareSum').onclick=function(){
      var text='부업 '+sum().toLocaleString()+'원 / 7일 '+weekSum().toLocaleString()+' · 시급 '+rate.toLocaleString()+'\n'+shareUrl()+'\n로컬 장부 · 투자권유 아님';
      if(navigator.share) navigator.share({text:text,url:shareUrl()}).catch(function(){});
      else if(navigator.clipboard) navigator.clipboard.writeText(text);
      try{legionTrack('share_peak',{})}catch(e){}
    };
    Array.prototype.forEach.call(document.querySelectorAll('[data-q]'),function(b){b.onclick=function(){var p=b.getAttribute('data-q').split('|');s.rows.push({job:p[0],won:+p[1],hrs:2,t:Date.now()});save(s);bumpStreak();render();try{legionTrack('activate',{quick:1})}catch(e){}};});
    document.getElementById('add').onclick=function(){
      s.rows.push({job:document.getElementById('job').value||'부업',won:+document.getElementById('won').value||0,hrs:+document.getElementById('hrs').value||0,t:Date.now()});
      save(s);bumpStreak();render();try{legionTrack('activate',{})}catch(e){} try{legionTrack('money_pipe_shown',{app:'sidehustle'})}catch(e){}
    };
  }
  try{
    var q=new URLSearchParams(location.search||'');
    var ref=q.get('ref');
    if(ref && ref!=='share' && ref!==kId() && !localStorage.getItem('shl_k_from')){
      localStorage.setItem('shl_k_from',ref);
      try{legionTrack('k_link',{from:ref})}catch(e){}
    }
  }catch(e){}
  try{legionTrack('session_start',{})}catch(e){}
  render();
})();
