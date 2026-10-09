'use client';
import {useState} from 'react';
import {Icon} from './ui';
import styles from './EppProductDetail.module.css';

export default function ProductQuoteForm({product}:{product:string}) {
 const [prepared,setPrepared]=useState(false);
 return <form className={styles.quoteForm} onChange={()=>setPrepared(false)} onSubmit={event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  const body=`Product: ${product}\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nQuantity: ${data.get('quantity')}\nSize / requirements: ${data.get('requirements') || 'Please discuss'}\n\nPlease share pricing and availability.`;
  window.location.href=`mailto:sales@parknonwoven.com?subject=${encodeURIComponent('Quote request: '+product)}&body=${encodeURIComponent(body)}`;
  setPrepared(true);
 }}>
  <div className={styles.fields}>
   <label htmlFor="quote-name">Your name<input id="quote-name" name="name" autoComplete="name" placeholder="Full name" required maxLength={100}/></label>
   <label htmlFor="quote-email">Work email<input id="quote-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254}/></label>
   <label htmlFor="quote-quantity">Quantity<input id="quote-quantity" name="quantity" type="number" min={1} step={1} placeholder="Number of units" required/></label>
   <label htmlFor="quote-requirements">Size / requirements <small>Optional</small><input id="quote-requirements" name="requirements" placeholder="Dimensions or intended use" maxLength={500}/></label>
  </div>
  <button className={styles.button} type="submit">Request a quote <Icon kind="arrow"/></button>
  <p className={styles.formNote} role="status">{prepared?'Enquiry prepared. Review and send it in your email app.':'Opens your email app with the enquiry ready to send.'}</p>
 </form>;
}
