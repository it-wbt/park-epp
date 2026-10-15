export type GoogleEnquiry = {name: string; email: string; phone: string; message: string; product?: string; website?: string; websiteName?: string; websiteType?: string; pageUrl?: string; enquirySource?: string; subject?: string};

// Apps Script replies through postMessage, avoiding opaque no-cors responses.
export function submitGoogleEnquiry(endpoint: string, enquiry: GoogleEnquiry, requestId: string): Promise<void> {
  const url = new URL(endpoint);
  if (url.origin !== 'https://script.google.com' || !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)) throw new Error('Google enquiry service is not configured correctly.');
  return new Promise((resolve,reject)=>{
    const frame=document.createElement('iframe');frame.name='park-enquiry-'+requestId;frame.title='Enquiry submission';frame.style.display='none';
    const form=document.createElement('form');form.method='POST';form.action=endpoint;form.target=frame.name;form.style.display='none';
    const field=document.createElement('input');field.type='hidden';field.name='payload';field.value=JSON.stringify({...enquiry,requestId,origin:location.origin});form.appendChild(field);
    const cleanup=()=>{clearTimeout(timer);window.removeEventListener('message',receive);form.remove();frame.remove();};
    const receive=(event:MessageEvent)=>{
      let hostname: string;try{hostname=new URL(event.origin).hostname;}catch{return;}
      if(!(hostname==='script.google.com'||hostname==='script.googleusercontent.com'||hostname.endsWith('-script.googleusercontent.com')))return;
      if(event.data?.type!=='park-enquiry-result'||event.data?.requestId!==requestId)return;
      cleanup();
      if(event.data.success===true)resolve();else reject(new Error(event.data.message || 'Unable to submit your enquiry. Please try again.'));
    };
    const timer=window.setTimeout(()=>{cleanup();reject(new Error('Submission could not be confirmed. Please retry; your existing enquiry will not be duplicated.'));},45000);
    window.addEventListener('message',receive);document.body.append(frame,form);form.submit();
  });
}
