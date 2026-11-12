// Regression: gespeicherte Sitzung + langsames/defektes Backend darf keine leere PWA ergeben.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function fixture({stored='saved-session',blockedStorage=false}={}){
 const nodes=new Map(),events={},timers=new Map(),storage=new Map(stored?[['kf_session',stored]]:[]);let timerId=0,resolveRequest,rejectRequest,fetches=0,registered=0,writes=0,reloads=0;
 const get=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',hidden:false,dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},before(){},prepend(){},insertAdjacentHTML(pos,html){this.innerHTML+=html;},addEventListener(){},showModal(){},close(){}});return nodes.get(s);};
 const listen=(n,f)=>(events[n]||(events[n]=[])).push(f);
 const c={console,Intl,Date,JSON,Set,Map,Math,String,Number,Object,Array,Error,structuredClone,crypto:crypto.webcrypto,URL,Blob,FormData,AbortController,
 setTimeout(fn,delay){timers.set(++timerId,{fn,delay});return timerId;},clearTimeout(id){timers.delete(id);},CSS:{escape:x=>x},
 window:{KF_API_URL:'https://api.example.test/',addEventListener:listen,scrollTo(){},matchMedia:()=>({matches:false})},
 location:{hash:'',pathname:'/dist/',reload(){reloads++;}},history:{replaceState(){}},
 navigator:{serviceWorker:{register:async()=>{registered++;return {};},addEventListener(){}}},
 document:{readyState:'loading',body:{classList:{add(){},remove(){}}},querySelector:get,querySelectorAll:()=>[],addEventListener:listen,createElement:()=>({click(){}})},
 localStorage:{getItem(k){if(blockedStorage)throw Error('Storage unavailable');return storage.get(k)||null;},setItem(k,v){writes++;storage.set(k,v);},removeItem(k){writes++;storage.delete(k);}},
 sessionStorage:{getItem(){return null;},setItem(){writes++;},removeItem(){writes++;}},
 fetch:async()=>{fetches++;return new Promise((resolve,reject)=>{resolveRequest=resolve;rejectRequest=reject;});}};
 c.window.location=c.location;vm.createContext(c);
 for(const file of ['startup.js','app.js','access-evidence.js','training-extensions.js','learning-ui.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),c,{filename:file});
 const dispatch=(name,event={})=>{for(const fn of events[name]||[])fn(event);};
 return {c,get,storage,timers,dispatch,start:()=>dispatch('DOMContentLoaded'),reject:e=>rejectRequest(e),resolve:data=>resolveRequest({json:async()=>({ok:true,data})}),stats:()=>({fetches,registered,writes,reloads})};
}
(async()=>{
 const f=fixture();assert.equal(f.stats().fetches,0,'Wait until extension scripts are initialized');f.start();assert(f.get('#content').innerHTML.includes('loginForm'));assert(!f.get('#content').innerHTML.includes('kfStartup'));assert.equal(f.stats().registered,1,'Update registration must not wait for the state API');assert.equal(f.stats().fetches,1);
 f.reject(Error('Failed to fetch'));await flush();assert(f.get('#content').innerHTML.includes('loginForm'));assert(f.get('#content').innerHTML.includes('Failed to fetch'));assert(f.get('#loginForm').innerHTML.includes('data-startup="retry"'));assert(!f.get('#content').innerHTML.includes('Die App konnte nicht geladen werden.'));assert.equal(f.storage.get('kf_session'),'saved-session');assert.equal(f.stats().writes,0);
 f.dispatch('click',{target:{closest:s=>s==='[data-startup]'?{dataset:{startup:'retry'}}:null},preventDefault(){}});assert.equal(f.stats().fetches,2);
 f.resolve({version:'2.0.0',user:{id:'p',role:'participant',name:'Teilnehmer'},members:[],vehicles:[],courses:[],enrollments:[],notifications:[]});await flush();assert(f.get('#content').innerHTML.includes('Servus, Teilnehmer.'),f.get('#content').innerHTML.slice(0,1500));assert.equal(f.storage.get('kf_session'),'saved-session');assert.equal(f.stats().writes,0);
 const broken=fixture();broken.start();broken.resolve({version:'2.0.0'});await flush();assert(broken.get('#content').innerHTML.includes('keine vollständige Sitzung'));assert.equal(broken.stats().writes,0);
 const expired=fixture();expired.start();expired.reject(Error('Bitte erneut anmelden.'));await flush();assert(expired.get('#content').innerHTML.includes('loginForm'));
 const abort=fixture();abort.start();const timeout=[...abort.timers.values()].find(x=>x.delay===65000);assert(timeout);abort.reject(Object.assign(Error('aborted'),{name:'AbortError'}));await flush();assert(abort.get('#content').innerHTML.includes('dauert zu lange'));assert(![...abort.timers.values()].some(x=>x.delay===65000));
 const storageBlocked=fixture({blockedStorage:true});storageBlocked.start();assert(storageBlocked.get('#content').innerHTML.includes('loginForm'),'Storage read failure must not stop the login screen');
 const html=fs.readFileSync('dist/index.html','utf8');assert(html.includes('id="loginForm"'),'Normal login must be present before scripts load');assert(!html.includes('id="kfStartup"'),'No separate start or error card');assert(html.indexOf('src="startup.js"')<html.indexOf('src="app.js"'));
 console.log('PASS: visible startup, failed/expired/incomplete sessions, safe retry, legacy timeout compatibility, independent updates and preserved session storage.');
})().catch(e=>{console.error(e);process.exitCode=1;});
