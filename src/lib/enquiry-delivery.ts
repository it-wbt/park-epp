export type EnquiryFields = Record<string, string>;

/** Fixed recipient: form submissions never open the visitor's email application. */
export async function deliverEnquiry(fields: EnquiryFields, subject: string) {
  if (fields.botcheck) throw new Error('Unable to submit this enquiry.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('https://formsubmit.co/ajax/sales@parknonwoven.com', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      signal: controller.signal,
      body: JSON.stringify({
        ...fields,
        _subject: subject,
        _replyto: fields.email,
        _template: 'table',
        _honey: '',
        _captcha: 'false',
      }),
    });
    const result = await response.json();
    if (!response.ok || (result.success !== true && result.success !== 'true') || /activat|confirm.*email|verify.*email/i.test(String(result.message || ''))) {
      throw new Error('Delivery was not confirmed. Please try again or contact sales@parknonwoven.com.');
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Delivery was not confirmed')) throw error;
    throw new Error('Delivery was not confirmed. Check your connection and try again, or contact sales@parknonwoven.com.');
  } finally {
    clearTimeout(timeout);
  }
}
