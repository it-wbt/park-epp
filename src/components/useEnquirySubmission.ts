'use client';
import {useRef, useState, type FormEvent} from 'react';
import {deliverEnquiry, type EnquiryFields} from '../lib/enquiry-delivery';

export function useEnquirySubmission(subject: string, product?: string) {
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const busy = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const fields: EnquiryFields = {};
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') fields[key] = value.trim();
    });
    if (product) fields.product = product;
    fields.page = window.location.origin + window.location.pathname;
    busy.current = true;
    setState('sending');
    setMessage('Sending your enquiry…');
    try {
      await deliverEnquiry(fields, subject);
      form.reset();
      setState('success');
      setMessage('Thank you! Your enquiry has been submitted to PARK. Our team will contact you.');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Unable to submit. Please try again.');
    } finally {
      busy.current = false;
    }
  }

  function clear() {
    if (!busy.current) { setState('idle'); setMessage(''); }
  }
  return {submit, state, message, clear, disabled: state === 'sending' || state === 'success'};
}
