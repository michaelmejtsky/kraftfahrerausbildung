// Zählt echte Tabellenzugriffe des State-Aufbaus, ausschließlich mit isolierten Daten im Speicher.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const counts={sheetLookups:0,rowCounts:0,dataReads:0},db={},props=new Map([['KF_DB_ID','isolated-db']]);
const sheet=t=>({getLastRow(){counts.rowCounts++;return db[t].length+1;},getRange(start,col,length,width){return {getValues(){counts.dataReads++;return db[t].slice(start-2,start-2+length).map(x=>[x.id,JSON.stringify(x)].slice(col-1,col-1+width));},setValues(rows){db[t][start-2]=JSON.parse(rows[0][1]);}};},appendRow(row){db[t].push(JSON.parse(row[1]));}});
const ss={getSheetByName(name){counts.sheetLookups++;const t=name.replace(/^KF_/,'');return Object.hasOwn(db,t)?sheet(t):null;}};
const ctx={console,Date,JSON,Set,Map,Math,Number,String,Object,Array,Error,PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k)||null})},SpreadsheetApp:{openById:()=>ss},Utilities:{computeDigest:(_,s)=>Array.from(crypto.createHash('sha256').update(s).digest()),base64EncodeWebSafe:x=>Buffer.from(x).toString('base64url'),DigestAlgorithm:{SHA_256:'sha256'},formatDate:()=> '2026-11-12'}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('backend/Code.gs','utf8'),ctx);for(const t of vm.runInContext('KF.tables',ctx))db[t]=[];
const admin={id:'admin',name:'Admin',role:'admin',active:true};db.Users.push(admin);db.Members.push({id:'m',userId:'p',firstName:'Teil',lastName:'Nehmer',active:true,licences:[]});db.Vehicles.push({id:'v',name:'Fahrzeug',requiredClasses:[],rooms:[],active:true});
db.Courses.push({id:'c',title:'Ausbildung',vehicleId:'v',sections:[{id:'chapter',title:'Kapitel',body:'Lerninhalt'}],quiz:{enabled:false,questions:[]},active:true});
for(let i=0;i<40;i++)db.Enrollments.push({id:'e'+i,memberId:'m',courseId:'c',vehicleId:'v',requirements:{requiredSessions:6,theoryEnabled:false,quizRequired:false,practicalEnabled:true,prerequisiteVehicleIds:[]}});
const state=ctx.kfState_(admin);assert.equal(state.enrollments.length,40);assert.equal(state.members.length,1);assert(state.enrollments.every(e=>e.lessons===0));
console.log('State table operations for 40 assigned courses:',counts);
if(!process.env.KF_MEASURE_BASELINE){assert(counts.sheetLookups<=24,'Repeated sheet lookups slow down every startup');assert(counts.rowCounts<=24,'Empty sheets must also be cached');assert(counts.dataReads<=24,'A table must only be read once per request');}
// Nach einem Schreiben darf eine zuvor leere Tabelle nicht aus dem alten Lesecache kommen.
ctx.kfSave_('Lessons',{id:'lesson',enrollmentId:'e0'});assert.equal(ctx.kfRows_('Lessons').length,1);
assert.equal(db.Enrollments.length,40);console.log('PASS: bounded startup reads, current writes and unchanged enrollments.');
