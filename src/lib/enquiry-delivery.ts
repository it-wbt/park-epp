import {googleEnquiryEndpoint,submitGoogleEnquiry} from './submit-google-enquiry';
import {buildEppEnquiry,enquirySourceFor,type EnquirySource} from './enquiry-source';

export type EnquiryFields = Record<string, string>;

/** Fixed recipient: form submissions never open the visitor's email application. */
export async function deliverEnquiry(fields: EnquiryFields, subject: string, options:{requestId?:string;source?:EnquirySource}={}) {
  if (fields.botcheck) throw new Error('Unable to submit this enquiry.');

  const source=options.source||enquirySourceFor(window.location.pathname,fields.product);
  const enquiry=buildEppEnquiry(fields,subject,source);
  await submitGoogleEnquiry(googleEnquiryEndpoint(),enquiry,options.requestId||crypto.randomUUID());
  // The Sheet is the authoritative save. Start the email notification without
  // blocking the visitor on FormSubmit's response; the form confirms as soon
  // as the Sheet has accepted the enquiry.
  void fetch('https://formsubmit.co/ajax/sales@parknonwoven.com', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      keepalive: true,
      body: JSON.stringify({
        ...fields,
        website_name: enquiry.websiteName,
        business: enquiry.websiteType,
        website_url: window.location.origin,
        page_url: enquiry.pageUrl,
        enquiry_source: enquiry.enquirySource,
        message: enquiry.message,
        _subject: enquiry.subject,
        _replyto: fields.email,
        _template: 'table',
        _honey: '',
        _captcha: 'false',
      }),
    }).catch(()=>{});
}
