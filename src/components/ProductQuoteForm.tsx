'use client';
import {useEnquirySubmission} from './useEnquirySubmission';
import {Icon} from './ui';
import styles from './EppProductDetail.module.css';

export default function ProductQuoteForm({product}:{product:string}) {
 const enquiry=useEnquirySubmission('Quote request: '+product,product);
 return <form className={styles.quoteForm} onChange={enquiry.clear} onSubmit={enquiry.submit} aria-busy={enquiry.state==='sending'}>
  <input name="botcheck" type="checkbox" tabIndex={-1} style={{display:'none'}} aria-hidden="true"/>
  <div className={styles.fields}>
   <label htmlFor="quote-name">Your name<input disabled={enquiry.state==='sending'} id="quote-name" name="name" autoComplete="name" placeholder="Full name" required maxLength={100}/></label>
   <label htmlFor="quote-email">Work email<input disabled={enquiry.state==='sending'} id="quote-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254}/></label>
   <label htmlFor="quote-quantity">Quantity<input disabled={enquiry.state==='sending'} id="quote-quantity" name="quantity" type="number" min={1} step={1} placeholder="Number of units" required/></label>
   <label htmlFor="quote-requirements">Size / requirements <small>Optional</small><input disabled={enquiry.state==='sending'} id="quote-requirements" name="requirements" placeholder="Dimensions or intended use" maxLength={500}/></label>
  </div>
  <button className={styles.button} type="submit" disabled={enquiry.disabled}>{enquiry.state==='sending'?'Sending...':'Request a quote'} <Icon kind="arrow"/></button>
  <p className={styles.formNote} role={enquiry.state==='error'?'alert':'status'}>{enquiry.message || 'Send your requirements to our team for pricing and availability.'}</p>
 </form>;
}
