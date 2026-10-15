import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {stripTypeScriptTypes} from 'node:module';

const googleCalls=[],mailCalls=[];
const env={};
const runtime={window:{location:{origin:'https://epp.example.com',pathname:'/products/test-part/'}},crypto:{randomUUID:()=> '11111111-1111-4111-8111-111111111111'},process:{env},AbortController,setTimeout,clearTimeout};
const cache={};
function load(name){
 if(cache[name])return cache[name];
 const source=fs.readFileSync('src/lib/'+name+'.ts','utf8');
 const stripped=stripTypeScriptTypes(source);
 const exports=[...stripped.matchAll(/export\s+(?:async\s+)?(?:function|const)\s+(\w+)/g)].map(match=>match[1]);
 const output=stripped.replace(/import\s*\{([^}]+)\}\s*from\s*'([^']+)';/g,(_,names,path)=>`const {${names}}=require('${path}');`).replace(/export\s+(?=(?:async\s+)?(?:function|const))/g,'')+'\nmodule.exports={'+exports.join(',')+'};';
 const module={exports:{}};
 const context=vm.createContext({...runtime,exports:module.exports,module,require:(path)=>path==='./submit-google-enquiry'?{submitGoogleEnquiry:async(...args)=>{googleCalls.push(args);}}:load(path.replace('./','')),fetch:async(url,request)=>{mailCalls.push({url,body:JSON.parse(request.body)});return {ok:true,json:async()=>({success:true})};}});
 vm.runInContext(output,context);cache[name]=module.exports;return module.exports;
}
const {deliverEnquiry}=load('enquiry-delivery');
const fields={name:'Example Buyer',email:'buyer@example.com',product:'Test EPP part',quantity:'100',requirements:'Custom dimensions'};
await deliverEnquiry(fields,'Quote request: Test EPP part');
assert.equal(mailCalls.length,1);
assert.equal(mailCalls[0].body._subject,'[PARK EPP] Quote request: Test EPP part');
assert.equal(mailCalls[0].body.website_name,'PARK EPP');
assert.equal(mailCalls[0].body.enquiry_source,'Product quote form');
assert.equal(mailCalls[0].body.page_url,'https://epp.example.com/products/test-part/');
assert.match(mailCalls[0].body.message,/quantity: 100/);
env.NEXT_PUBLIC_GOOGLE_ENQUIRY_URL='https://script.google.com/macros/s/TEST/exec';
await deliverEnquiry({...fields,phone:'1234567890'},'Chatbot enquiry',{requestId:'stable-id',source:'Chatbot'});
assert.equal(googleCalls.length,1);assert.equal(mailCalls.length,1);
assert.equal(googleCalls[0][1].website,'');
assert.equal(googleCalls[0][1].websiteName,'PARK EPP');
assert.equal(googleCalls[0][1].enquirySource,'Chatbot');
assert.equal(googleCalls[0][1].phone,'1234567890');
assert.equal(googleCalls[0][2],'stable-id');
await assert.rejects(deliverEnquiry({...fields,botcheck:'on'},'Enquiry'));
assert.equal(googleCalls.length,1);

// Execute the actual Apps Script against an in-memory Sheet and mail service.
const rows=[],sent=[];
let failEmail=false;
const sheet={getLastRow:()=>rows.length,appendRow:row=>rows.push([...row]),setFrozenRows(){},getRange(row,col,count=1,width=1){return {
 setValues(values){for(let y=0;y<values.length;y++){rows[row-1+y] ||= [];for(let x=0;x<values[y].length;x++)rows[row-1+y][col-1+x]=values[y][x];}},
 getValues:()=>Array.from({length:count},(_,y)=>Array.from({length:width},(_,x)=>rows[row-1+y]?.[col-1+x]||'')),
 getValue:()=>rows[row-1]?.[col-1],setValue(value){rows[row-1][col-1]=value;},
 createTextFinder(id){return {matchEntireCell(){return this;},findNext(){const index=rows.findIndex((r,i)=>i>0&&r[0]===id);return index<0?null:{getRow:()=>index+1};}};}
 };}};
const settings={SHEET_ID:'test-sheet',RECIPIENT_EMAIL:'sales@example.com',ALLOWED_ORIGINS:'https://epp.example.com,https://filtration.example.com',SITE_NAMES_BY_ORIGIN_JSON:JSON.stringify({'https://epp.example.com':'PARK EPP','https://filtration.example.com':'PARK Filtration'})};
const context=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:key=>settings[key]})},LockService:{getScriptLock:()=>({waitLock(){},hasLock:()=>true,releaseLock(){}})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet,insertSheet:()=>sheet})},MailApp:{sendEmail:message=>{if(failEmail)throw Error('Mock mail failure');sent.push(message);}},HtmlService:{XFrameOptionsMode:{ALLOWALL:1},createHtmlOutput:html=>({html,setXFrameOptionsMode(){return this;}})}});
vm.runInContext(fs.readFileSync('integrations/google-enquiries/Code.gs','utf8'),context);
const base={name:'Example Buyer',email:'buyer@example.com',phone:'1234567890',message:'Need EPP trays',product:'Cell tray',website:'',origin:'https://epp.example.com',pageUrl:'https://epp.example.com/products/cell-tray/',enquirySource:'Product quote form',subject:'[PARK EPP] Quote request: Cell tray',requestId:'11111111-1111-4111-8111-111111111111'};
const post=payload=>context.doPost({parameter:{payload:JSON.stringify(payload)}}).html;
assert.match(post(base),/"success":true/);
assert.equal(rows.length,2);assert.equal(rows[1][8],'Sent');assert.equal(rows[1][9],'PARK EPP');assert.equal(rows[1][10],base.pageUrl);assert.equal(rows[1][11],'Product quote form');assert.equal(sent[0].subject,base.subject);assert.match(sent[0].body,/Website: PARK EPP/);
post(base);assert.equal(rows.length,2);assert.equal(sent.length,1);
failEmail=true;const retry={...base,requestId:'22222222-2222-4222-8222-222222222222'};assert.match(post(retry),/"success":false/);assert.equal(rows[2][8],'Failed');
failEmail=false;assert.match(post(retry),/"success":true/);assert.equal(rows.length,3);assert.equal(rows[2][8],'Sent');
const filtration={...base,origin:'https://filtration.example.com',pageUrl:'https://filtration.example.com/contact/',subject:'Filtration enquiry',requestId:'33333333-3333-4333-8333-333333333333'};
post(filtration);assert.equal(rows[3][9],'PARK Filtration');assert.equal(sent.at(-1).subject,'[PARK Filtration] Filtration enquiry');
const count=rows.length;assert.match(post({...base,origin:'https://unapproved.example.com'}),/"success":false/);assert.equal(rows.length,count);
assert.match(post({...base,pageUrl:'https://different.example.com/'}),/"success":false/);
assert.equal(rows[0][8],'Email status');assert.equal(rows[0][9],'Website');
console.log('PASS: EPP source metadata, email-only fallback, Google routing, honeypot, source columns, shared-site labels, confirmed delivery, idempotent retries and rejection of invalid origins. No live mail or Sheet writes.');
