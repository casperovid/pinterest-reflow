/// pinterest-reflow.js
(()=>{
if(window.top!==window||window.__pinNoAds)return;
const st={removed:0};
window.__pinNoAds=st;
const bad=o=>o.is_promoted===true;
const clean=(o,d)=>{
if(!o||typeof o!=='object'||d>14)return;
if(Array.isArray(o)){for(let i=o.length-1;i>=0;i--){const x=o[i];if(x&&typeof x==='object'&&!Array.isArray(x)&&bad(x)){o.splice(i,1);st.removed++}else clean(x,d+1)}return}
for(const k in o)clean(o[k],d+1);
};
const jp=JSON.parse;
JSON.parse=function(t,r){const v=jp.call(this,t,r);try{if(typeof t==='string'&&/"is_promoted"\s*:\s*true/.test(t))clean(v,0)}catch(e){}return v};
const rj=Response.prototype.json;
Response.prototype.json=function(){return rj.call(this).then(v=>{try{if(/\/resource\//.test(this.url))clean(v,0)}catch(e){}return v})};
const xd=Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype,'response');
if(xd&&xd.get){const g=xd.get;Object.defineProperty(XMLHttpRequest.prototype,'response',{configurable:true,enumerable:xd.enumerable,get(){const v=g.call(this);try{if(this.readyState===4&&this.responseType==='json'&&v&&typeof v==='object'&&!this.__pnc){this.__pnc=1;clean(v,0)}}catch(e){}return v}})}
})();
