
/* LEGION_WAVE_80_today_counter */
try{var _dk=new Date().toDateString();var _o=JSON.parse(localStorage.getItem('lw_p40_side_hus_today_counter')||'{}');if(_o.d!==_dk)_o={d:_dk,n:0};_o.n=(_o.n||0)+1;localStorage.setItem('lw_p40_side_hus_today_counter',JSON.stringify(_o));}catch(e){}
(function(){
  var K='shl_v1';
  var SHARE_BASE='https://hosuman08-netizen.github.io/side-hustle/';
  function load(){
    try{
      var raw=JSON.parse(localStorage.getItem(K)||'{"rows":[]}');
      if(!raw||typeof raw!=='object') return {rows:[],inv:[]};
      if(!raw.rows) raw.rows=[];
      if(!raw.inv) raw.inv=[];
      return raw;
    }catch(e){return{rows:[],inv:[]};}
  }
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
  var signPref='+';
  var tmTick=null;
  try{signPref=localStorage.getItem('shl_sign')||'+';}catch(e){}
  /* GOLD50 TOP5: Toggl 원클릭 — 시작/정지 로컬 elapsed → 시간 필드. APY/은행 0 */
  function loadTimer(){try{return JSON.parse(localStorage.getItem('shl_timer')||'{}');}catch(e){return{};}}
  function saveTimer(t){try{localStorage.setItem('shl_timer',JSON.stringify(t||{}));}catch(e){}}
  function fmtElapsed(ms){
    ms=Math.max(0,+ms||0);
    var h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000), sec=Math.floor((ms%60000)/1000);
    return [h,m,sec].map(function(x){return String(x).padStart(2,'0');}).join(':');
  }
  function timerMs(t){
    t=t||loadTimer();
    if(t.start==null) return 0;
    return Math.max(0,(t.stop||Date.now())-t.start);
  }
  function timerHrs(t){return Math.round((timerMs(t)/3600000)*10)/10;}
  /* WAVE189: 오늘행 탭=#job 포커스. APY/은행 0. 입력·버튼·영수증은 그대로 */
  /* WAVE193: 포커스 후 #job 링 0.4s. 타이머·영수증 훔치지 않음 */
  /* WAVE197: 링 중 재탭=링 재시작. data-re-ring. 타이머·영수증 훔치지 않음. APY/은행 0 */
  /* WAVE200: 링 탭=링 끄기. data-ring-off. 타이머·영수증 훔치지 않음. APY/은행 0 */
  /* WAVE204: 끈 뒤 #job 포커스 유지. hold≠arm. 타이머·영수증 훔치지 않음. APY/은행 0 */
  /* WAVE206: 포커스 링 재탭=재시작 분리. data-re-from-focus. 타이머·영수증 훔치지 않음. APY/은행 0 */
  var jobRingTok=0;
  function todayJobFocusRingMs(){ return 400; }
  function todayJobFocusRingOn(el){
    el=el||(typeof document!=='undefined'?document.getElementById('job'):null);
    if(!el) return false;
    if(el._ringT) return true;
    if(el.getAttribute&&el.getAttribute('data-focus-ring')==='1') return true;
    return false;
  }
  function clearTodayJobFocusRing(){
    var el=typeof document!=='undefined'?document.getElementById('job'):null;
    if(!el) return;
    el.style.outline='';
    el.style.outlineOffset='';
    el.style.boxShadow='';
    if(el.setAttribute){
      el.setAttribute('data-focus-ring','0');
      el.setAttribute('data-re-ring','0');
    }
    el._ringT=0;
  }
  function armTodayJobFocusRing(){
    var el=typeof document!=='undefined'?document.getElementById('job'):null;
    if(!el) return false;
    var retr=todayJobFocusRingOn(el);
    el.style.outline='2px solid #67e8f9';
    el.style.outlineOffset='2px';
    el.style.boxShadow='0 0 0 4px #67e8f955';
    if(el.setAttribute){
      el.setAttribute('data-focus-ring','1');
      el.setAttribute('data-re-ring', retr?'1':'0');
      el.setAttribute('data-ring-off','0');
    }
    if(el._ringT) try{clearTimeout(el._ringT);}catch(e0){}
    var tok=++jobRingTok;
    el._ringT=setTimeout(function(){
      if(tok!==jobRingTok) return;
      clearTodayJobFocusRing();
    }, todayJobFocusRingMs());
    return true;
  }
  function killTodayJobFocusRing(){
    jobRingTok++;
    var el=typeof document!=='undefined'?document.getElementById('job'):null;
    if(el && el._ringT) try{clearTimeout(el._ringT);}catch(e0){}
    clearTodayJobFocusRing();
    if(el && el.setAttribute){
      el.setAttribute('data-ring-off','1');
      el.setAttribute('data-ring-tap','1');
    }
    holdTodayJobFocus();
    return true;
  }
  /* WAVE204: 끈 뒤 #job 포커스 유지 · 링 재점화 0 · APY/은행 0 */
  function holdTodayJobFocus(){
    var el=typeof document!=='undefined'?document.getElementById('job'):null;
    if(!el) return false;
    try{ if(el.focus) el.focus(); }catch(e1){}
    if(el.setAttribute) el.setAttribute('data-focus-after-kill','1');
    return true;
  }
  /* WAVE206: 포커스 링 재탭=재시작 분리 · 킬과 분리 · APY/은행 0 */
  function restartTodayJobRingFromFocus(){
    var el=typeof document!=='undefined'?document.getElementById('job'):null;
    if(!el||!el.getAttribute||el.getAttribute('data-focus-after-kill')!=='1') return false;
    armTodayJobFocusRing();
    if(el.setAttribute){
      el.setAttribute('data-re-ring','1');
      el.setAttribute('data-re-from-focus','1');
    }
    return true;
  }
  function focusTodayJob(){
    var inp=typeof document!=='undefined'?document.getElementById('job'):null;
    if(!inp) return false;
    try{ if(!inp.hasAttribute||!inp.hasAttribute('tabindex')) inp.setAttribute('tabindex','0'); }catch(e0){}
    try{ if(inp.focus) inp.focus(); }catch(e1){}
    if(inp.setAttribute) inp.setAttribute('data-job-focus','1');
    var row=typeof document!=='undefined'?document.getElementById('todayRow'):null;
    if(row&&row.setAttribute) row.setAttribute('data-job-focus','1');
    armTodayJobFocusRing();
    return true;
  }
  function todayRowTapShouldFocus(t){
    if(!t) return false;
    var tag=(t.tagName||'').toLowerCase();
    if(tag==='input'||tag==='button'||tag==='a'||tag==='select'||tag==='textarea'||tag==='label') return false;
    if(t.closest){
      if(t.closest('input,button,a,select,textarea,label,#timerCard,#receiptOut')) return false;
    }
    return true;
  }
  function tickTimer(){
    var el=document.getElementById('tmEl');
    if(!el) return;
    el.textContent=fmtElapsed(timerMs());
  }
  /* GOLD50 TOP3: 수입 vs 비용 — 부호만. APY/가짜수익 금지. 숫자=유저입력 */
  function sumIn(){return s.rows.reduce(function(a,b){return a+(b.sign==='-'?0:(+b.won||0));},0);}
  function sumOut(){return s.rows.reduce(function(a,b){return a+(b.sign==='-'?(+b.won||0):0);},0);}
  function sum(){return sumIn();}
  function hours(){return s.rows.reduce(function(a,b){return a+(b.sign==='-'?0:(+b.hrs||0));},0);}
  function fomoLeft(){
    var end=new Date(); end.setHours(24,0,0,0);
    var ms=Math.max(0,end-Date.now());
    return Math.floor(ms/3600000)+'h '+Math.floor((ms%3600000)/60000)+'m';
  }
  function monthPaceTip(total, goal){
    var now=new Date();
    var dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
    var day=now.getDate();
    var leftDays=Math.max(1,dim-day+1);
    var need=Math.max(0,goal-total);
    var per=Math.round(need/leftDays);
    return '월말까지 일 '+per.toLocaleString()+'원 페이스 · 잔여일 '+leftDays;
  }
  function weekSum(){
    var cut=Date.now()-7*864e5;
    return s.rows.reduce(function(a,r){return a+((r.t||0)>=cut&&r.sign!=='-'?(+r.won||0):0);},0);
  }
  function todaySum(){
    var t0=new Date(); t0.setHours(0,0,0,0); var cut=t0.getTime();
    return s.rows.reduce(function(a,r){return a+((r.t||0)>=cut&&r.sign!=='-'?(+r.won||0):0);},0);
  }
  function weekSpark(){
    var days=[], max=1;
    for(var i=6;i>=0;i--){
      var d=new Date(); d.setDate(d.getDate()-i); d.setHours(0,0,0,0);
      var start=d.getTime(), end=start+864e5;
      var v=s.rows.reduce(function(a,r){var t=r.t||0; return a+(t>=start&&t<end&&r.sign!=='-'?(+r.won||0):0);},0);
      days.push({k:(d.getMonth()+1)+'/'+d.getDate(),v:v}); if(v>max)max=v;
    }
    return days.map(function(d){
      var h=Math.max(3,Math.round((d.v/max)*36));
      return '<div title="'+d.k+': '+d.v.toLocaleString()+'" style="flex:1;height:40px;display:flex;align-items:flex-end"><div style="width:100%;height:'+h+'px;background:'+(d.v?'#67e8f9':'#2a2438')+';border-radius:3px 3px 0 0"></div></div>';
    }).join('');
  }
  function byJob(){
    var m={}, hrs={};
    s.rows.forEach(function(r){
      if(r.sign==='-') return;
      var j=r.job||'기타';
      m[j]=(m[j]||0)+(+r.won||0);
      hrs[j]=(hrs[j]||0)+(+r.hrs||0);
    });
    return Object.keys(m).map(function(k){
      var rate=hrs[k]?Math.round(m[k]/hrs[k]):0;
      return{j:k,a:m[k],h:hrs[k]||0,rate:rate};
    }).sort(function(a,b){return b.a-a.a;});
  }
  function prevWeekSum(){
    var cut0=Date.now()-14*864e5, cut1=Date.now()-7*864e5;
    return s.rows.reduce(function(a,r){var t=r.t||0; return a+(t>=cut0&&t<cut1&&r.sign!=='-'?(+r.won||0):0);},0);
  }
  function render(){
    var t=sum(), h=hours(), rate=h?Math.round(t/h):0;
    var out=sumOut(), net=t-out;
    try{var br=+(localStorage.getItem('shl_best')||0); if(rate>br){localStorage.setItem('shl_best',rate);br=rate;} }catch(e){var br=rate;}
    var st=JSON.parse(localStorage.getItem('shl_streak')||'{}');
    var sc=st.count||0;
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast))/86400000)>=7;
    var goal=+(localStorage.getItem('shl_goal')||500000);
    var gPct=goal?Math.min(100,Math.round(t/goal*100)):0;
    var ws=weekSum(); var pws=prevWeekSum(); var wDelta=ws-pws; var ts=todaySum(); var mTip=monthPaceTip(t, goal);
    var jobRates=byJob().slice().sort(function(a,b){return b.rate-a.rate;});
    var topRate=jobRates.length&&jobRates[0].rate?jobRates[0]:null;
    /* GOLD50 TOP1: Wave/FreshBooks — 오늘 1행 폼 최상단. 통계 뒤로. APY/은행 0 */
    root.innerHTML='<div class="card" style="font-size:11px;color:#67e8f9">투명 금융 · 로컬 장부 · 투자권유 아님 · 허위수입 없음</div>'
      +'<div class="card" id="todayRow" data-tap-focus="1"><b style="cursor:pointer" title="탭=부업명 포커스">오늘 1행</b> <span class="chip">TTV</span>'
      +'<p class="sub" style="margin:4px 0 6px">일감·원·시간 · 탭=부업명 · 통계는 아래 · APY/은행 0</p>'
      +'<div class="row" style="margin:6px 0"><button id="signIn"'+(signPref!=='-'?'':' class="sec"')+'>수입 +</button><button id="signOut"'+(signPref==='-'?'':' class="sec"')+'>비용 −</button></div>'
      +'<p class="sub" style="margin:0 0 4px">부호만 · 허위수익/APY 없음 · 입력 숫자만</p>'
      +'<input id="job" placeholder="부업명"/><input id="won" type="number" placeholder="'+(signPref==='-'?'비용(원)':'수입(원)')+'"/><input id="hrs" type="number" step="0.5" placeholder="시간"/><button class="sec" data-q="배달|35000">배달 35k</button><button class="sec" data-q="원고|50000">원고 50k</button><button id="add">기록</button>'
      +'<button class="sec" id="undo" style="margin-top:6px">↩ 직전 취소</button>'
      +'<div id="timerCard" style="margin:10px 0 8px;padding:10px;border:1px solid #67e8f944;border-radius:12px">'
      +'<div class="sub" style="margin:0 0 4px">작업 타이머 · 로컬 elapsed · APY 0 · 은행 0</div>'
      +'<div id="tmEl" style="font-size:28px;font-weight:800;font-variant-numeric:tabular-nums;margin:4px 0 8px">'+fmtElapsed(timerMs())+'</div>'
      +'<div class="row"><button id="tmStart">시작</button><button class="sec" id="tmStop">정지</button><button class="sec" id="tmUse">시간을 필드에</button></div></div>'
      +'<div id="receiptOut" class="sub" style="margin-top:10px;padding-top:8px;border-top:1px solid #2a2438">영수증 스캔 없음 · 카메라/클라우드 0 · 링크아웃만'
      +'<div style="margin-top:6px"><a href="https://www.expensify.com/" target="_blank" rel="noopener">Expensify</a> · <a href="https://www.keeper.app/" target="_blank" rel="noopener">Keeper Tax</a></div></div></div>'
      +'<div class="card"><span class="chip">총수입 <b>'+t.toLocaleString()+'</b></span> <span class="chip">비용 <b style="color:#f87171">'+out.toLocaleString()+'</b></span> <span class="chip">순액 <b>'+net.toLocaleString()+'</b></span> <span class="chip">오늘 <b>'+ts.toLocaleString()+'</b></span> <span class="chip">7일 <b>'+ws.toLocaleString()+'</b></span> <span class="chip">전주대비 <b style="color:'+(wDelta>=0?'#67e8f9':'#f87171')+'">'+(wDelta>=0?'+':'')+wDelta.toLocaleString()+'</b></span> <span class="chip">건수 <b>'+s.rows.length+'</b></span> <span class="chip">시간 <b>'+h+'</b>h</span> <span class="chip">시급 <b>'+rate.toLocaleString()+'</b></span> <span class="chip">최고 <b>'+(br||rate).toLocaleString()+'</b></span>'+(topRate?' <span class="chip">TOP시급 <b>'+topRate.j+' '+topRate.rate.toLocaleString()+'</b></span>':'')+' <span class="chip">목표 <b>'+gPct+'%</b></span> <span class="chip">🔥 '+sc+'일'+(sc>=3&&ready?' · 🛡️':'')+'</span> <span class="chip">리셋 '+fomoLeft()+'</span>'
      +'<div class="bar" style="height:6px;background:#2a2438;border-radius:4px;margin-top:8px;overflow:hidden"><i style="display:block;height:100%;width:'+gPct+'%;background:'+(gPct>=100?'#4ade80':'#67e8f9')+'"></i></div>'
      +'<div class="row" style="gap:4px;margin-top:10px;align-items:flex-end;height:44px">'+weekSpark()+'</div>'
      +'<p class="sub" style="margin:4px 0 0">7일 수입 스파크</p>'
      +'<p class="sub" style="margin-top:6px">'+mTip+'</p>'
      +'<label class="sub">월 목표(원)</label><input id="goal" type="number" value="'+goal+'"/><button class="sec" id="setGoal">목표 저장</button></div>'
      +'<div class="card"><div class="sub">인보이스 1행 · 청구 기록일 뿐 · 장부 수입에 자동합산 안 함</div>'
      +'<input id="invWho" placeholder="상대/클라이언트"/><input id="invAmt" type="number" placeholder="청구액(원 · 수입 아님)"/>'
      +'<input id="invMemo" placeholder="메모(선택)"/><button class="sec" id="addInv">인보이스 발행</button>'
      +'<div id="invList" class="sub" style="margin-top:8px"></div></div>'
      +'<div class="card"><b>7일 수입</b><div id="shlSpark" style="display:flex;align-items:flex-end;gap:3px;height:32px;margin-top:8px"></div></div>'+'<div class="card" id="jobBox"><b>일감 시급</b><p class="sub" style="margin:4px 0 8px">칩 3개 · 원/시간 · 유저 행만 · 가짜수입 0</p><div id="jobs"></div></div>'
      +'<div class="card" id="rateCard"><b>시급환산</b><p class="sub" style="margin:4px 0 8px">시급 = 수입 ÷ 시간 · 비용 제외 · APY/가짜수익 없음</p><div id="rateList"></div></div>'
      +'<div class="card" id="list"></div>'
      +'<div class="card" id="moneyPipe" style="text-align:center;font-size:12px">'
      +'<div style="color:#67e8f9;font-weight:700;margin-bottom:6px">💎 투명 루프</div>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/budget-pulse/?utm_source=sidehustle&utm_medium=pipe">💓 Budget</a>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/cost-basis/?utm_source=sidehustle&utm_medium=pipe">🧮 Cost Basis</a>'
      +''
      +'</div>'
      +'<button id="shareSum" style="width:100%;margin-top:8px;padding:11px;border:0;border-radius:10px;background:#1c1826;color:#ece8f1;font-weight:700">요약 공유</button>';
    var sp=document.getElementById('shlSpark');
    if(sp){
      var vals=[],max=1;
      for(var i=6;i>=0;i--){
        var d=new Date(); d.setDate(d.getDate()-i); d.setHours(0,0,0,0);
        var n0=d.getTime(), n1=n0+864e5;
        var sum=s.rows.reduce(function(a,r){return a+((r.t||0)>=n0&&(r.t||0)<n1&&r.sign!=='-'?(+r.won||0):0);},0);
        vals.push(sum); if(sum>max)max=sum;
      }
      sp.innerHTML=vals.map(function(n){var h=Math.max(3,Math.round(n/max*28));return '<div style="flex:1;height:'+h+'px;background:'+(n>0?'#67e8f9':'#2a2438')+';border-radius:2px"></div>';}).join('');
    }
    var jb=document.getElementById('jobs');
    if(jb){
      /* GOLD50 TOP2 leftover: Harvest/Toggl — 일감 칩 + 원/시간 3줄. 유저 행만. */
      var tops=byJob().slice().sort(function(a,b){return b.rate-a.rate;}).slice(0,3);
      if(!tops.length){
        jb.innerHTML='<span class="chip">행 없음</span><p class="sub" style="margin-top:6px">금액·시간을 넣으면 원/시간 3줄 · 발명 0</p>';
      }else{
        var chips=tops.map(function(x){
          return '<span class="chip">'+x.j+' <b>'+(x.h?x.rate.toLocaleString():'—')+'</b>원/시간</span>';
        }).join(' ');
        var lines=tops.map(function(x,i){
          var line=x.h?(x.a.toLocaleString()+'원 ÷ '+x.h+'h = <b>'+x.rate.toLocaleString()+'</b>원/시간'):(x.a.toLocaleString()+'원 · 시간 0 → 시급 없음');
          return '<div style="padding:4px 0;border-bottom:1px solid #2a2438;font-size:13px">'+(i+1)+'. '+x.j+' · '+line+'</div>';
        }).join('');
        jb.innerHTML=chips+'<div style="margin-top:8px">'+lines+'</div>';
      }
    }
    var rl=document.getElementById('rateList');
    if(rl){
      var rrows=byJob().slice().sort(function(a,b){return b.rate-a.rate;});
      if(!s.rows.length){
        rl.innerHTML='<div class="sub">기록 없음 — 금액과 시간을 넣으면 시급이 나옵니다. 잔액/APY 발명 없음.</div>';
      }else{
        var head='<div style="margin-bottom:8px">전체 시급 <b>'+(h?rate.toLocaleString():'—')+'</b>원/h <span class="chip">'+t.toLocaleString()+'원 ÷ '+h+'h</span></div>';
        rl.innerHTML=head+rrows.map(function(x){
          var line=x.h?(x.a.toLocaleString()+'원 ÷ '+x.h+'h = <b>'+x.rate.toLocaleString()+'</b>원/h'):(x.a.toLocaleString()+'원 · 시간 0 → 시급 없음');
          return '<div style="display:flex;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid #2a2438;font-size:13px"><span>'+x.j+'</span><span style="text-align:right">'+line+'</span></div>';
        }).join('');
      }
    }
    var invEl=document.getElementById('invList');
    if(invEl){
      var invs=s.inv||[];
      invEl.innerHTML=invs.length?invs.slice().reverse().slice(0,8).map(function(r,idx){
        var real=invs.length-1-idx;
        return '<div style="padding:4px 0;display:flex;justify-content:space-between;gap:8px;align-items:center">'
          +'<span>'+(r.who||'상대')+' · '+(+r.amt||0).toLocaleString()+'원 · '+(r.st||'발행')+(r.memo?' · '+String(r.memo).replace(/</g,'&lt;'):'')+'</span>'
          +'<button class="sec" data-invdel="'+real+'" style="padding:2px 8px;font-size:11px">삭제</button></div>';
      }).join('')+'<div class="sub" style="margin-top:4px">인보이스 합계 미포함 · 입금되면 위 장부에 직접 기록</div>':'아직 인보이스 없음 — 빈 행만, 수입 발명 없음';
      Array.prototype.forEach.call(document.querySelectorAll('[data-invdel]'),function(b){
        b.onclick=function(){s.inv.splice(+b.getAttribute('data-invdel'),1);save(s);render();};
      });
    }
    var ai=document.getElementById('addInv');
    if(ai) ai.onclick=function(){
      var who=(document.getElementById('invWho').value||'').trim()||'상대';
      var amt=+document.getElementById('invAmt').value||0;
      var memo=(document.getElementById('invMemo').value||'').trim();
      s.inv=s.inv||[];
      s.inv.push({who:who,amt:amt,memo:memo,st:'발행',t:Date.now()});
      save(s); render();
      try{legionTrack('invoice',{amt:amt})}catch(e){}
    };
    if(!s.rows.length){
      document.getElementById('list').innerHTML='<div class="sub">수입 기록 없음 — 직접 입력만. 예시금액 자동기입 없음.<br>인보이스는 청구 기록이며 수입이 아닙니다.</div>';
    }else{
      document.getElementById('list').innerHTML=s.rows.slice().reverse().slice(0,15).map(function(r,idx){
        var real=s.rows.length-1-idx;
        return '<div data-del="'+real+'" style="padding:6px 0;border-bottom:1px solid #2a2438;cursor:pointer">'+(r.sign==='-'?'<span style="color:#f87171">−비용</span> ':'')+r.job+' · '+(r.sign==='-'?'−':'')+(+r.won||0).toLocaleString()+'원 · '+(+r.hrs||0)+'h <small style="opacity:.5">탭삭제</small></div>';
      }).join('');
      Array.prototype.forEach.call(document.querySelectorAll('[data-del]'),function(row){
        row.onclick=function(){s.rows.splice(+row.getAttribute('data-del'),1);save(s);render();try{legionTrack('del',{})}catch(e){}};
      });
    }
    var sg=document.getElementById('setGoal');
    if(sg) sg.onclick=function(){localStorage.setItem('shl_goal',String(+document.getElementById('goal').value||500000));render();try{legionTrack('goal',{})}catch(e){}};
    var ub=document.getElementById('undo');
    if(ub) ub.onclick=function(){if(!s.rows.length)return;s.rows.pop();save(s);render();try{legionTrack('undo',{})}catch(e){}};
    if(!document.getElementById('exportCsv')){var bx=document.createElement('button'); bx.id='exportCsv'; bx.className='sec'; bx.style.width='100%'; bx.style.marginTop='8px'; bx.textContent='CSV 복사'; bx.onclick=function(){var rows=s.rows.map(function(r){return [r.job,r.sign==='-'?'-':'+',r.won,r.hrs].join(',');}).join('\n'); if(navigator.clipboard)navigator.clipboard.writeText('job,sign,won,hrs\n'+rows); try{legionTrack('share_peak',{csv:1})}catch(e){}}; var app=document.getElementById('app'); if(app) app.appendChild(bx);}
    var tr=document.getElementById('todayRow');
    if(tr){
      try{ if(!tr.hasAttribute||!tr.hasAttribute('tabindex')) tr.setAttribute('tabindex','-1'); }catch(e0){}
      tr.onclick=function(ev){
        var t=ev&&(ev.target||ev.srcElement);
        if(!todayRowTapShouldFocus(t)) return;
        if(todayJobFocusRingOn()){ killTodayJobFocusRing(); return; }
        if(restartTodayJobRingFromFocus()) return;
        focusTodayJob();
      };
      tr.onkeydown=function(ev){
        if(!ev) return;
        if(ev.key!=='Enter'&&ev.key!==' ') return;
        var t=ev.target||ev.srcElement;
        if(t&&t!==tr) return;
        ev.preventDefault();
        if(todayJobFocusRingOn()){ killTodayJobFocusRing(); return; }
        if(restartTodayJobRingFromFocus()) return;
        focusTodayJob();
      };
    }
    var si=document.getElementById('signIn');
    if(si) si.onclick=function(){signPref='+'; try{localStorage.setItem('shl_sign','+');}catch(e){} render();};
    var so=document.getElementById('signOut');
    if(so) so.onclick=function(){signPref='-'; try{localStorage.setItem('shl_sign','-');}catch(e){} render();};
    if(tmTick){clearInterval(tmTick); tmTick=null;}
    var ts=document.getElementById('tmStart');
    if(ts) ts.onclick=function(){
      var cur=loadTimer();
      if(cur.start&&!cur.stop) return;
      saveTimer({start:Date.now()});
      render();
      try{legionTrack('activate',{timer:'start'})}catch(e){}
    };
    var tp=document.getElementById('tmStop');
    if(tp) tp.onclick=function(){
      var cur=loadTimer();
      if(!cur.start||cur.stop) return;
      cur.stop=Date.now();
      saveTimer(cur);
      render();
      try{legionTrack('activate',{timer:'stop',hrs:timerHrs(cur)})}catch(e){}
    };
    var tu=document.getElementById('tmUse');
    if(tu) tu.onclick=function(){
      var hrs=timerHrs();
      var inp=document.getElementById('hrs');
      if(inp) inp.value=hrs?String(hrs):'0';
      try{legionTrack('activate',{timer:'use',hrs:hrs})}catch(e){}
    };
    if(loadTimer().start&&!loadTimer().stop){
      tmTick=setInterval(tickTimer,1000);
    }
    document.getElementById('shareSum').onclick=function(){
      var text='부업 '+sum().toLocaleString()+'원 / 7일 '+weekSum().toLocaleString()+' · 시급 '+rate.toLocaleString()+'\n'+shareUrl()+'\n로컬 장부 · 투자권유 아님';
      if(navigator.share) navigator.share({text:text,url:shareUrl()}).catch(function(){});
      else if(navigator.clipboard) navigator.clipboard.writeText(text);
      try{legionTrack('share_peak',{})}catch(e){}
    };
    Array.prototype.forEach.call(document.querySelectorAll('[data-q]'),function(b){b.onclick=function(){var p=b.getAttribute('data-q').split('|');s.rows.push({job:p[0],won:+p[1],hrs:2,t:Date.now()});save(s);bumpStreak();render();try{legionTrack('activate',{quick:1})}catch(e){}};});
    document.getElementById('add').onclick=function(){
      s.rows.push({job:document.getElementById('job').value||'부업',won:+document.getElementById('won').value||0,hrs:+document.getElementById('hrs').value||0,sign:signPref==='-'?'-':'+',t:Date.now()});
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

/* LEGION_WAVE_35_fomo_chip */
setTimeout(function(){try{if(document.getElementById('lw_fomo_35'))return;var end=new Date(); end.setHours(24,0,0,0);var ms=Math.max(0,end-Date.now());var h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000);var d=document.createElement('div'); d.id='lw_fomo_35';d.style.cssText='font-size:11px;opacity:.75;margin:6px 0;color:#e0b552';d.textContent='window '+h+'h '+m+'m · W35';var app=document.getElementById('app')||document.body; app.insertBefore(d, app.firstChild);}catch(e){}},40);
})();