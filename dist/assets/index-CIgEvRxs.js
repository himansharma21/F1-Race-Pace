var x=Object.defineProperty;var O=(t,e,s)=>e in t?x(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var S=(t,e,s)=>O(t,typeof e!="symbol"?e+"":e,s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();async function F(t,e){const s=await fetch(t,{signal:e});if(!s.ok)throw new Error(`${s.status} ${s.statusText} for ${t}`);return s.json()}const L="https://api.openf1.org/v1";async function P(t){const e=`${L}/sessions?year=${t}&session_name=Race`;return F(e)}async function k(t){const e=`${L}/drivers?session_key=${t}`;return F(e)}async function N(t){const e=`https://api.openf1.org/v1/laps?session_key=${t}`,s=await fetch(e);if(!s.ok)throw new Error(`Lap fetch failed ${s.status}`);return s.json()}function m(t){const e=document.getElementById("status");e&&(e.textContent=t)}function M(t,e){t.innerHTML=`
    <section class="card">
      <h2>Races</h2>
      <ul style="list-style:none;padding:0;margin:0;">
        ${e.map(s=>{const o=new Date(s.date_start).toLocaleDateString(void 0,{dateStyle:"medium"}),n=s.meeting_name??`${s.country_name??""} GP`;return`<li class="card" style="margin:0.5rem 0;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;">
              <div>
                <div><b>${f(n)}</b></div>
                <div class="caption">${f(s.circuit_short_name??"")} • ${o}</div>
              </div>
              <a class="btn" href="#/race/${s.session_key}">Open</a>
            </div>
          </li>`}).join("")}
      </ul>
    </section>
  `}function E(t,e,s,o,n){const a=e.meeting_name??`${e.country_name??""} GP`,l=new Date(e.date_start).toLocaleString(void 0,{dateStyle:"medium"}),p=c=>{var u;return((u=o[c])==null?void 0:u.name)??String(c)},i=c=>{var u;return((u=o[c])==null?void 0:u.team)??""},r=c=>{var u;return(u=o[c])==null?void 0:u.colour},d=(c,u)=>`<div style="display:flex;justify-content:space-between;"><span>${c}</span><span class="mono">${u}</span></div>`,v=n.fastest?`${g(r(n.fastest.driver_number))}${f(p(n.fastest.driver_number))} — ${n.fastest.lap.toFixed(3)}s`:"n/a",b=n.slowest?`${g(r(n.slowest.driver_number))}${f(p(n.slowest.driver_number))} — ${n.slowest.lap.toFixed(3)}s`:"n/a",w=n.mostConsistent?`${g(r(n.mostConsistent.driver_number))}${f(p(n.mostConsistent.driver_number))} — σ ${n.mostConsistent.stdev.toFixed(3)}`:"n/a";t.innerHTML=`
    <a href="#/" style="text-decoration:none;">← Back</a>

    <!-- Statistics card -->
    <section class="card">
      <h2>Statistics</h2>
      <div class="caption">${f(a)} <span>(${l})</span></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:8px;">
        <div class="card">
          <h3 style="margin-top:0;">Pace</h3>
          ${d("Median pace (avg laps)",n.medianPace==null?"n/a":`${n.medianPace.toFixed(3)}s`)}
          ${d("Total stddev (Σ per-driver σ)",n.totalStdDev==null?"n/a":n.totalStdDev.toFixed(3))}
          ${d("Median fastest lap",n.medianFastest==null?"n/a":`${n.medianFastest.toFixed(3)}s`)}
        </div>
        <div class="card">
          <h3 style="margin-top:0;">Leaders</h3>
          ${d("Fastest driver by fast lap",v)}
          ${d("Slowest driver by fast lap",b)}
          ${d("Most consistent (lowest σ)",w)}
        </div>
      </div>
    </section>

    <!-- Detailed table -->
    <section class="card">
      <h2>${f(a)} <span class="caption">(${l})</span></h2>
      <div class="caption">Driver race pace analysis (based on lap durations)</div>
      <div style="overflow:auto;margin-top:0.5rem;">
        <table class="table">
          <thead>
            <tr>
              <th>Driver</th><th>Team</th><th>Laps</th><th>Avg (s)</th><th>StDev</th><th>Fastest Lap</th>
            </tr>
          </thead>
          <tbody>
            ${s.map(c=>`<tr>
                <td>${g(r(c.driver_number))}${f(p(c.driver_number))}</td>
                <td>${f(i(c.driver_number))}</td>
                <td class="mono">${c.laps}</td>
                <td class="mono">${c.avg.toFixed(3)}</td>
                <td class="mono">${c.stdev.toFixed(3)}</td>
                <td class="mono">${c.fastest.toFixed(3)}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `}function g(t){return t?`<span style="display:inline-block;width:10px;height:10px;background:${t.startsWith("#")?t:`#${t}`};border-radius:50%;margin-right:6px;vertical-align:middle;"></span>`:""}function f(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}class I{constructor(){S(this,"routes",[]);S(this,"notFound",()=>{})}add(e,s){this.routes.push({pattern:e,handler:s})}setNotFound(e){this.notFound=e}start(){window.addEventListener("hashchange",()=>this.resolve()),this.resolve()}resolve(){const e=window.location.hash||"#/";for(const s of this.routes){const o=e.match(s.pattern);if(o){const n=o.groups??{};s.handler(n);return}}this.notFound({})}}async function R(t){const e=`laps_${t}`;let s=null;const o=localStorage.getItem(e);return o?s=JSON.parse(o):(s=(await N(t)).filter(a=>a.lap_duration),localStorage.setItem(e,JSON.stringify(s))),C(s)}function C(t){const e=new Map;for(const o of t)e.has(o.driver_number)||e.set(o.driver_number,[]),e.get(o.driver_number).push(o.lap_duration);const s=[];for(const[o,n]of e){const a=n.length,l=n.reduce((r,d)=>r+d,0)/a,p=Math.sqrt(n.map(r=>(r-l)**2).reduce((r,d)=>r+d,0)/a),i=Math.min(...n);s.push({driver_number:o,avg:l,stdev:p,fastest:i,laps:a})}return s.sort((o,n)=>o.avg-n.avg)}function T(t){if(!t.length)return{medianPace:null,totalStdDev:null,medianFastest:null,fastest:unknown,slowest:null,mostConsistent:null};const e=i=>{const r=[...i].sort((b,w)=>b-w),d=r.length;if(d===0)return null;const v=Math.floor(d/2);return d%2?r[v]:(r[v-1]+r[v])/2},s=e(t.map(i=>i.avg)),o=t.reduce((i,r)=>i+r.stdev,0),n=e(t.map(i=>i.fastest)),a=t.reduce((i,r)=>!i||r.fastest<i.lap?{driver_number:r.driver_number,lap:r.fastest}:i,null),l=t.reduce((i,r)=>!i||r.fastest>i.lap?{driver_number:r.driver_number,lap:r.fastest}:i,null),p=t.reduce((i,r)=>!i||r.stdev<i.stdev?{driver_number:r.driver_number,stdev:r.stdev}:i,null);return{medianPace:s,totalStdDev:o,medianFastest:n,fastest:a,slowest:l,mostConsistent:p}}async function B(t){const e=`drivers_${t}`,s=localStorage.getItem(e);if(s)return JSON.parse(s);const o=await k(t),n={};for(const a of o){const l=a.full_name??a.name_acronym??String(a.driver_number);n[a.driver_number]={name:l,team:a.team_name??void 0,colour:a.team_colour??void 0}}return localStorage.setItem(e,JSON.stringify(n)),n}const j=document.getElementById("controls"),D=document.getElementById("season"),$=document.getElementById("view");let h=[];j.addEventListener("submit",async t=>{t.preventDefault(),window.location.hash="#/",await _()});async function _(){const t=Number(D.value);m("Loading races…");try{h=(await P(t)).sort((e,s)=>new Date(e.date_start).getTime()-new Date(s.date_start).getTime()),M($,h),m(`Loaded ${h.length} races for ${t}.`)}catch(e){console.error(e),m("Failed to load race list."),$.innerHTML=`<section class="card">Could not load races for ${t}.</section>`}}async function H(t){m("Loading race pace data…");let e=h.find(s=>s.session_key===t);if(!e)try{await _(),e=h.find(s=>s.session_key===t)}catch{console.log("Could not load race pace data...")}try{const[s,o]=await Promise.all([R(t),B(t)]),n=T(s),a=e??{session_key:t,meeting_key:0,session_name:"Race",date_start:new Date().toISOString(),year:Number(D.value),meeting_name:"(Unknown GP)"};E($,a,s,o,n),m("Done.")}catch(s){console.error(s),$.innerHTML='<a href="#/">← Back</a><div class="card">Failed to load race pace data.</div>',m("Failed to load.")}}const y=new I;y.add(/^#\/$/,()=>_());y.add(/^#\/race\/(?<id>\d+)$/,({id:t})=>H(Number(t)));y.setNotFound(()=>{window.location.hash="#/"});y.start();_().catch(console.error);
