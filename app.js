(function(){
  var KEY='shl_v1';
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
  function save(a){localStorage.setItem(KEY,JSON.stringify(a))}
  var el=document.getElementById('tool');
  function render(){
    var rows=load();
    var sum=rows.reduce(function(a,r){return a+(+r.amt||0)},0);
    el.innerHTML='<input id="src" placeholder="출처 (협찬/숏폼/앱)"/><input id="amt" type="number" placeholder="금액"/><button id="add">기록</button><div style="margin-top:10px">합계: <b style="color:#67e8f9">'+sum.toLocaleString()+'</b></div><div id="list" style="margin-top:8px;font-size:13px;color:#8a8398"></div>';
    document.getElementById('list').innerHTML=rows.slice().reverse().slice(0,20).map(function(r){return '<div>'+r.src+': '+Number(r.amt).toLocaleString()+'</div>'}).join('');
    document.getElementById('add').onclick=function(){
      var src=document.getElementById('src').value.trim()||'misc';
      var amt=+document.getElementById('amt').value||0;
      var rows=load(); rows.push({src:src,amt:amt,t:Date.now()}); save(rows); render();
      try{legionTrack('activate',{amt:amt})}catch(e){}
    };
  }
  render(); try{legionTrack('session_start',{})}catch(e){}
})();
