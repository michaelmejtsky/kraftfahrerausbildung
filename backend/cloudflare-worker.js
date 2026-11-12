/** Kraftfahrerausbildung: API-Weiterleitung und verschlüsselte Geräte-Pushs. */
const PUSH_MAX_BYTES=4096;
const PUSH_DOMAINS=['fcm.googleapis.com','updates.push.services.mozilla.com','push.services.mozilla.com','web.push.apple.com'];
const te=new TextEncoder();
function pushB64ToBytes(s){
 const x=String(s||'').replace(/-/g,'+').replace(/_/g,'/');
 const raw=atob(x+'='.repeat((4-x.length%4)%4));
 return Uint8Array.from(raw,c=>c.charCodeAt(0));
}
function pushB64(bytes){
 let s='';for(const b of bytes)s+=String.fromCharCode(b);
 return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}
function pushJoin(...parts){
 const size=parts.reduce((total,p)=>total+p.length,0),out=new Uint8Array(size);
 let off=0;for(const p of parts){out.set(p,off);off+=p.length;}
 return out;
}
async function pushHmac(key,bytes){
 const k=await crypto.subtle.importKey('raw',key,{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return new Uint8Array(await crypto.subtle.sign('HMAC',k,bytes));
}
async function pushExpand(prk,info,length){
 return (await pushHmac(prk,pushJoin(info,Uint8Array.of(1)))).slice(0,length);
}
function pushDestination(endpoint){
 try{
  const u=new URL(endpoint);
  if(u.protocol!=='https:'||u.username||u.password||u.port||
     !(PUSH_DOMAINS.includes(u.hostname.toLowerCase())||/^(?:[a-z0-9-]+\.)+push\.apple\.com$/.test(u.hostname.toLowerCase())))return null;
  return u;
 }catch{return null;}
}
function pushValidSubscription(s){
 if(!s||typeof s!=='object'||!pushDestination(s.endpoint))return false;
 try{return pushB64ToBytes(s.p256dh).length===65&&pushB64ToBytes(s.auth).length>=16;}
 catch{return false;}
}
async function pushEncrypt(text,subscription){
 const ua=pushB64ToBytes(subscription.p256dh);
 const auth=pushB64ToBytes(subscription.auth);
 const clientKey=await crypto.subtle.importKey('raw',ua,{name:'ECDH',namedCurve:'P-256'},false,[]);
 const ephemeral=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
 const as=new Uint8Array(await crypto.subtle.exportKey('raw',ephemeral.publicKey));
 const shared=new Uint8Array(await crypto.subtle.deriveBits({name:'ECDH',public:clientKey},ephemeral.privateKey,256));
 const prk=await pushHmac(auth,shared);
 const ikm=await pushExpand(prk,pushJoin(te.encode('WebPush: info'),Uint8Array.of(0),ua,as),32);
 const salt=crypto.getRandomValues(new Uint8Array(16));
 const base=await pushHmac(salt,ikm);
 const cek=await pushExpand(base,pushJoin(te.encode('Content-Encoding: aes128gcm'),Uint8Array.of(0)),16);
 const nonce=await pushExpand(base,pushJoin(te.encode('Content-Encoding: nonce'),Uint8Array.of(0)),12);
 const key=await crypto.subtle.importKey('raw',cek,'AES-GCM',false,['encrypt']);
 const plaintext=pushJoin(te.encode(text),Uint8Array.of(2));
 const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:nonce},key,plaintext));
 const recordSize=4096;
 const rs=new Uint8Array([recordSize>>>24,(recordSize>>>16)&255,(recordSize>>>8)&255,recordSize&255]);
 const body=pushJoin(salt,rs,Uint8Array.of(as.length),as,encrypted);
 if(body.length>PUSH_MAX_BYTES)throw Error('Push message too long');
 return body;
}

// Der separate VAPID-Schlüssel wird stabil und zweckgebunden aus dem bereits vorhandenen
// Worker-Secret abgeleitet. Er wird nur im Worker berechnet und niemals ausgegeben.
let kfVapidCache=null;
async function kfVapidKeys(secret){
 if(kfVapidCache?.secret===secret)return kfVapidCache.keys;
 const prefix=Uint8Array.from([0x30,0x41,0x02,0x01,0x00,0x30,0x13,0x06,0x07,0x2a,0x86,0x48,0xce,0x3d,0x02,0x01,0x06,0x08,0x2a,0x86,0x48,0xce,0x3d,0x03,0x01,0x07,0x04,0x27,0x30,0x25,0x02,0x01,0x01,0x04,0x20]);
 let privateKey;
 for(let i=0;i<8;i++){
  const d=await pushHmac(te.encode(secret),te.encode('kraftfahrerausbildung:webpush:v1:'+i));
  try{privateKey=await crypto.subtle.importKey('pkcs8',pushJoin(prefix,d),{name:'ECDSA',namedCurve:'P-256'},true,['sign']);break;}catch{}
 }
 if(!privateKey)throw Error('Push-Schlüssel konnte nicht eingerichtet werden.');
 const jwk=await crypto.subtle.exportKey('jwk',privateKey);
 const publicKey=pushB64(pushJoin(Uint8Array.of(4),pushB64ToBytes(jwk.x),pushB64ToBytes(jwk.y)));
 const keys={privateKey,publicKey};kfVapidCache={secret,keys};return keys;
}
async function kfVapidToken(keys,audience,subject){
 const header=pushB64(te.encode(JSON.stringify({typ:'JWT',alg:'ES256'})));
 const payload=pushB64(te.encode(JSON.stringify({aud:audience,exp:Math.floor(Date.now()/1000)+3600,sub:subject})));
 const token=header+'.'+payload;
 const sig=new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},keys.privateKey,te.encode(token)));
 if(sig.length!==64)throw Error('Push-Signatur ungültig.');return token+'.'+pushB64(sig);
}
async function kfPushOne(env,entry,notice,keys){
 const s=entry.subscription,dest=pushDestination(s?.endpoint);
 if(!dest||!pushValidSubscription(s))return {id:entry.id,ok:false,gone:true};
 const payload=JSON.stringify({title:String(notice.title||'Kraftfahrerausbildung').slice(0,100),body:'Öffne die App, um deine Nachricht anzusehen.',id:String(notice.id||'').slice(0,100)});
 try{
  const subject=(env.KF_APP_ORIGINS||'').split(',').map(x=>x.trim()).find(x=>/^https:\/\/[^/]+$/.test(x));
  if(!subject)throw Error('App-Adresse fehlt.');
  const [body,jwt]=await Promise.all([pushEncrypt(payload,s),kfVapidToken(keys,dest.origin,subject)]);
  const res=await fetch(s.endpoint,{method:'POST',headers:{'Content-Encoding':'aes128gcm','Content-Type':'application/octet-stream','Authorization':'vapid t='+jwt+', k='+keys.publicKey,'TTL':'86400','Urgency':'normal'},body,redirect:'manual',signal:AbortSignal.timeout(9000)});
  return {id:entry.id,ok:res.status>=200&&res.status<300,gone:res.status===404||res.status===410,status:res.status};
 }catch{return {id:entry.id,ok:false,gone:false,status:0};}
}
async function kfBackend(env,action,data={},token=''){
 const response=await fetch(env.KF_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,data,token,workerKey:env.KF_WORKER_KEY}),redirect:'follow',signal:AbortSignal.timeout(55000)});
 if(!response.ok)throw Error('Backend vorübergehend nicht erreichbar.');return response.json();
}
function kfConfigured(env){return !!(env.KF_SCRIPT_URL&&env.KF_WORKER_KEY&&/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(env.KF_SCRIPT_URL));}
async function kfDrainPush(env){
 if(!kfConfigured(env))return;
 const keys=await kfVapidKeys(env.KF_WORKER_KEY),claim=await kfBackend(env,'_pushClaim');
 if(!claim.ok||!Array.isArray(claim.data?.jobs))return;
 for(const job of claim.data.jobs.slice(0,3)){
  const results=await Promise.all((job.devices||[]).slice(0,10).map(entry=>kfPushOne(env,entry,job.notification,keys)));
  await kfBackend(env,'_pushAck',{id:job.id,claimId:job.claimId,results});
 }
}
export default {
 async scheduled(_event,env,ctx){ctx.waitUntil(kfDrainPush(env));},
 async fetch(request,env){
  const origin=request.headers.get('Origin')||'',allowed=(env.KF_APP_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
  const cors={'Access-Control-Allow-Origin':allowed.includes(origin)?origin:'null','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json;charset=utf-8'}});
  if(!allowed.includes(origin))return json({ok:false,error:'App-Ursprung nicht freigegeben.'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(request.method!=='POST')return json({ok:false,error:'POST erforderlich.'},405);
  if(!kfConfigured(env))return json({ok:false,error:'Eigenes Kraftfahrerausbildungs-Backend noch nicht eingerichtet.'},503);
  if(Number(request.headers.get('Content-Length'))>3000000)return json({ok:false,error:'Anfrage zu groß.'},413);
  try{
   const body=await request.text();if(body.length>3000000)return json({ok:false,error:'Anfrage zu groß.'},413);
   const p=JSON.parse(body);if(typeof p.action!=='string'||p.action.length>50)return json({ok:false,error:'Ungültige Anfrage.'},400);
   if(p.action.startsWith('_'))return json({ok:false,error:'Interne Aktion nicht freigegeben.'},403);
   if(p.action==='pushConfig')return json({ok:true,data:{publicKey:(await kfVapidKeys(env.KF_WORKER_KEY)).publicKey}});
   const result=await kfBackend(env,p.action,p.data||{},p.token||'');return json(result);
  }catch{return json({ok:false,error:'Verbindung fehlgeschlagen. Bitte erneut versuchen.'},502);}
 }
};
