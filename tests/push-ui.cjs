'use strict';
// Prüft die iPhone-Geste ohne Netzwerk oder echte Berechtigungen.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let subscribed=false,lastOperation,registered,notificationsCalls=0;
const panel={querySelector(){return null;}},body={insertAdjacentHTML(){}},subscription={endpoint:'https://fcm.googleapis.com/test',options:{applicationServerKey:new Uint8Array([4,1,2]).buffer},toJSON(){return {endpoint:this.endpoint,keys:{p256dh:'fixture',auth:'fixture'}};},async unsubscribe(){return true;}};
const registration={pushManager:{getSubscription:async()=>null,subscribe:()=>{subscribed=true;return Promise.resolve(subscription);}}};
const handlers={};const ctx={console,Uint8Array,Array,Promise,Error,String,atob,document:{addEventListener:(type,fn)=>handlers[type]=fn},
 navigator:{userAgent:'iPhone',platform:'iPhone',standalone:true,serviceWorker:{register:async()=>registration,ready:Promise.resolve(registration),getRegistration:async()=>registration,addEventListener(){}}},
 window:{PushManager:function(){},Notification:function(){},matchMedia:()=>({matches:true})},Notification:{permission:'default'},
 user:{id:'u'},state:{preview:null},route:'notifications',busy:false,selectedId:'',
 $:selector=>selector==='#content'?body:selector==='#content .kf-push-panel'?panel:null,esc:s=>String(s),
 notificationsPage:()=>{notificationsCalls++;},api:async(action,data)=>{if(action==='pushConfig')return {publicKey:'BAEC'};if(action==='pushRegister'){registered=data.subscription;return {ok:true};}if(action==='pushStatus')return {currentDeviceEnabled:false,enabledDevices:0};throw Error(action);},
 operation:fn=>{lastOperation=fn();return lastOperation;},render(){},toast(){},load:async()=>{},kfApiOriginal:async()=>({ok:true})};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/push-ui.js','utf8'),ctx);
(async()=>{await ctx.kfPushCheck();const event={target:{closest:()=>({dataset:{pushAction:'enable'},disabled:false})}};handlers.click(event);assert.equal(subscribed,true,'Safari subscribe() must be called during the click, before any await');await lastOperation;assert.equal(registered.endpoint,subscription.endpoint);
 ctx.state.preview={readOnly:true};ctx.notificationsPage();assert.equal(notificationsCalls,1);await assert.rejects(ctx.kfPushEnable(),/schreibgeschützt/);
 console.log('PASS: prepared iPhone subscription uses the direct user gesture; preview stays read-only.');})().catch(e=>{console.error(e);process.exitCode=1;});
