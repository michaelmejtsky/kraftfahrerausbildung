/** Eigenen Worker anlegen. KEINE GAB-URL oder GAB-Schlüssel verwenden.
 * Variablen: KF_SCRIPT_URL = eigene Apps-Script-/exec-URL
 * Secret: KF_WORKER_KEY = gleichnamige Skripteigenschaft
 * KF_APP_ORIGINS = erlaubte App-Ursprünge, durch Komma getrennt
 */
export default {async fetch(request,env){
 const origin=request.headers.get('Origin')||'',allowed=(env.KF_APP_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
 const cors={'Access-Control-Allow-Origin':allowed.includes(origin)?origin:'null','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
 const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json;charset=utf-8'}});
 if(!allowed.includes(origin))return json({ok:false,error:'App-Ursprung nicht freigegeben.'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(request.method!=='POST')return json({ok:false,error:'POST erforderlich.'},405);
 if(!env.KF_SCRIPT_URL||!env.KF_WORKER_KEY||!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(env.KF_SCRIPT_URL))return json({ok:false,error:'Eigenes Kraftfahrerausbildungs-Backend noch nicht eingerichtet.'},503);
 if(Number(request.headers.get('Content-Length'))>3000000)return json({ok:false,error:'Anfrage zu groß.'},413);
 try{const body=await request.text();if(body.length>3000000)return json({ok:false,error:'Anfrage zu groß.'},413);const p=JSON.parse(body);if(typeof p.action!=='string'||p.action.length>50)return json({ok:false,error:'Ungültige Anfrage.'},400);
 const upstream=await fetch(env.KF_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:p.action,data:p.data||{},token:p.token||'',workerKey:env.KF_WORKER_KEY}),redirect:'follow',signal:AbortSignal.timeout(55000)});
 if(!upstream.ok)return json({ok:false,error:'Backend vorübergehend nicht erreichbar.'},502);const result=await upstream.json();return json(result);
 }catch{return json({ok:false,error:'Verbindung fehlgeschlagen. Bitte erneut versuchen.'},502);}
}};
