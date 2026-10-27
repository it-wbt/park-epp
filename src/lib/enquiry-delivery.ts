import {googleEnquiryEndpoint,submitGoogleEnquiry} from './submit-google-enquiry';
import {buildEppEnquiry,enquirySourceFor,type EnquirySource} from './enquiry-source';

export type EnquiryFields = Record<string, string>;

/** Fixed recipient: form submissions never open the visitor's email application. */
export async function deliverEnquiry(fields: EnquiryFields, subject: string, options:{requestId?:string;source?:EnquirySource}={}) {
  if (fields.botcheck) throw new Error('Unable to submit this enquiry.');

  const source=options.source||enquirySourceFor(window.location.pathname,fields.product);
  const enquiry=buildEppEnquiry(fields,subject,source);
  await submitGoogleEnquiry(googleEnquiryEndpoint(),enquiry,options.requestId||crypto.randomUUID());
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('https://formsubmit.co/ajax/sales@parknonwoven.com', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      signal: controller.signal,
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
    });
    const result = await response.json();
    if (!response.ok || (result.success !== true && result.success !== 'true') || /activat|confirm.*email|verify.*email/i.test(String(result.message || ''))) {
      throw new Error('Your enquiry was saved, but email delivery was not confirmed. Please retry or contact sales@parknonwoven.com.');
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Your enquiry was saved')) throw error;
    throw new Error('Your enquiry was saved, but email delivery was not confirmed. Please retry or contact sales@parknonwoven.com.');
  } finally {
    clearTimeout(timeout);
  }
}
