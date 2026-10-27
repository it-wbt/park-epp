// Configure this Script Property before deploying the web app:
// ALLOWED_ORIGINS (comma-separated site origins).
// Execute as the owner, with access for Anyone. No account keys go in the website.
var PARK_LEADS_SHEET_ID = '1c10nm2Zs-7Jfs4xfeq86zLu6NSt2E9FkbEqnRZCzQUM';
function doPost(e) {
  var payload, result = {type:'park-enquiry-result',success:false,requestId:''};
  var origin = '';
  var lock = LockService.getScriptLock();
  try {
    payload = JSON.parse(e.parameter.payload || '{}');
    result.requestId = String(payload.requestId || '');
    var settings = PropertiesService.getScriptProperties();
    var allowed = (settings.getProperty('ALLOWED_ORIGINS') || '').split(',').map(function(value){return value.trim();});
    origin = String(payload.origin || '');
    if (allowed.indexOf(origin) === -1) throw new Error('This website is not configured for enquiries.');
    if (!/^[a-zA-Z0-9-]{20,80}$/.test(result.requestId)) throw new Error('Invalid request.');
    if (payload.action === 'chat-message') {
      var sessionId = String(payload.sessionId || '');
      var speaker = String(payload.speaker || '');
      var chatMessage = String(payload.message || '').trim();
      var chatWebsite = String(payload.website || '').trim();
      if (!/^[a-zA-Z0-9-]{20,80}$/.test(sessionId) || (speaker !== 'user' && speaker !== 'bot') || !chatMessage || chatMessage.length > 4000 || chatWebsite.length > 253) throw new Error('Invalid chat message.');
      lock.waitLock(20000);
      var chatBook = SpreadsheetApp.openById(settings.getProperty('SHEET_ID') || PARK_LEADS_SHEET_ID);
      var chatSheet = chatBook.getSheetByName('Chat Logs') || chatBook.insertSheet('Chat Logs');
      if (chatSheet.getLastRow() === 0) {
        chatSheet.appendRow(['Session ID','Received at','Website','Page origin','Speaker','Message']);
        chatSheet.setFrozenRows(1);
      }
      chatSheet.appendRow([sessionId,new Date(),safeCell_(chatWebsite),origin,speaker,safeCell_(chatMessage)]);
      result.success=true;
      return enquiryReply_(result,origin);
    }
    var name = String(payload.name || '').trim();
    var email = String(payload.email || '').trim();
    var phone = String(payload.phone || '').trim();
    var message = String(payload.message || '').trim();
    var product = String(payload.product || '').trim();
    var website = String(payload.website || '').trim();
    var requirement = String(payload.requirement || '').trim();
    if (website.length > 253 || requirement.length > 2000 || name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || phone.length > 30 || message.length > 12000 || !message || product.length > 150) throw new Error('Please check your contact details and try again.');
    var sheetId = settings.getProperty('SHEET_ID') || PARK_LEADS_SHEET_ID;
    if (!sheetId) throw new Error('Enquiry Sheet is not configured.');
    lock.waitLock(20000);
    var book = SpreadsheetApp.openById(sheetId);
    var sheet = book.getSheetByName('Enquiries') || book.insertSheet('Enquiries');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Request ID','Received at','Name','Mobile','Email','Product','Query','Website','Page origin','Status','Requirement']);
      sheet.setFrozenRows(1);
    } else if (sheet.getRange(1,10).getValue() === 'Email status') {
      sheet.getRange(1,10).setValue('Status');
    }
    if (sheet.getRange(1,11).getValue() !== 'Requirement') sheet.getRange(1,11).setValue('Requirement');
    var match = sheet.getLastRow() > 1 ? sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(result.requestId).matchEntireCell(true).findNext() : null;
    var row;
    if (match) {
      row = match.getRow();
      if (sheet.getRange(row,10).getValue() !== 'Saved') sheet.getRange(row,10).setValue('Saved');
      result.success=true;
      return enquiryReply_(result,origin);
    } else {
      sheet.appendRow([result.requestId,new Date(),safeCell_(name),safeCell_(phone),safeCell_(email),safeCell_(product),safeCell_(message),safeCell_(website),origin,'Saved',safeCell_(requirement)]);
    }
    result.success=true;
  } catch (error) {
    result.message = error.message || 'Unable to submit your enquiry. Please try again.';
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
  return enquiryReply_(result,origin);
}

function safeCell_(value) {return /^[=+\-@]/.test(value) ? "'"+value : value;}
function enquiryReply_(result,origin) {
  var data=JSON.stringify(result).replace(/</g,'\\u003c');
  var target=JSON.stringify(origin).replace(/</g,'\\u003c');
  return HtmlService.createHtmlOutput('<!doctype html><html><head><base target="_top"></head><body><script>window.top.postMessage('+data+','+target+');</script></body></html>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
