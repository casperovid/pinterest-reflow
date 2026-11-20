/// pinterest-reflow.js
(()=>{
if(window.top!==window||window.__pinNoAds)return;
const SEL='[data-grid-item="true"]',known=new Map();
let cols=null,gap=16,base=null,list=null,lastW=null,raf=0;
const n=v=>parseFloat(v)||0;
const xy=e=>{const m=/translateX\(([-\d.]+)px\)\s*translateY\(([-\d.]+)px\)/.exec(e.style.transform);return m?[+m[1],+m[2]]:null};
const idxOf=(e,i)=>{const d=e.querySelector('[data-grid-item-idx]');return d?+d.getAttribute('data-grid-item-idx'):1e9+i};
const isSp=e=>{for(const d of e.querySelectorAll('div'))if(!d.children.length&&d.textContent.trim()==='Sponsored')return true;return false};
const rd=x=>Math.round(x*10)/10;
const mo=new MutationObserver(m=>{if(!raf&&m.some(x=>x.type==='childList'||(list&&list.contains(x.target))))raf=requestAnimationFrame(run)});
const obs=()=>mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
function run(){
raf=0;
const items=[...document.querySelectorAll(SEL)];
if(!items.length)return;
list=items[0].parentElement;
const w=n(items[0].style.width);
if(lastW!==null&&Math.abs(w-lastW)>0.5){known.clear();cols=null;items.forEach(e=>delete e.dataset.rfT)}
lastW=w;
const rec=items.map((el,i)=>{
const idx=idxOf(el,i),p=xy(el),foreign=!!p&&el.style.transform!==el.dataset.rfT;
let r=known.get(idx);
if(!r){r={h:0,sp:false,ox:p?p[0]:0,oy:p?p[1]:0};known.set(idx,r)}
else if(foreign){r.ox=p[0];r.oy=p[1]}
const h=n(el.style.height);if(h)r.h=h;
if(!r.sp&&isSp(el))r.sp=true;
return{el,idx,r};
});
if(!cols){
const by={};
for(const r of known.values())(by[rd(r.ox)]??=[]).push(r);
cols=Object.keys(by).map(Number).sort((a,b)=>a-b);
const gs=[];
for(const x of cols){const a=by[x].sort((p,q)=>p.oy-q.oy);for(let k=1;k<a.length;k++){const g=a[k].oy-a[k-1].oy-a[k-1].h;if(g>=0&&g<100)gs.push(g)}}
gap=gs.length?Math.min(...gs):16;
base=cols.map(x=>Math.min(...by[x].map(r=>r.oy)));
}
const hts=base.slice(),pos=new Map();
for(const k of [...known.keys()].sort((a,b)=>a-b)){
const r=known.get(k);if(r.sp)continue;
let c=0;for(let j=1;j<hts.length;j++)if(hts[j]<hts[c]-0.5)c=j;
pos.set(k,[cols[c],hts[c]]);hts[c]+=r.h+gap;
}
mo.disconnect();
for(const{el,idx,r}of rec){
if(r.sp){if(el.style.display!=='none')el.style.setProperty('display','none','important');continue}
const q=pos.get(idx);if(!q)continue;
el.style.transform='translateX('+q[0]+'px) translateY('+q[1]+'px)';
el.dataset.rfT=el.style.transform;
}
const H=Math.max(...hts)-gap;
if(isFinite(H)&&H>0)list.style.height=H+'px';
obs();
}
const start=()=>{obs();run()};
window.__pinNoAds={stop(){mo.disconnect();cancelAnimationFrame(raf)}};
if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
})();
