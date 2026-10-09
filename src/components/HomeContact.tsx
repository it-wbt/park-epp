'use client';
import {useState} from 'react';
import {useEnquirySubmission} from './useEnquirySubmission';
import {ArrowUpRight, UserRound, Mail, Send, Check, MessageSquareText} from './ContactIcons';
import styles from './HomeContact.module.css';

/** PARK Filtration's contact layout, with the EPP application content. */
export default function HomeContact() {
  const enquiry=useEnquirySubmission('New EPP application enquiry');
  const [message, setMessage] = useState('');

  return (
    <section id="contact" className={styles.section} aria-labelledby="home-contact-heading">
      <div className={styles.introduction} data-reveal>
        <div className={styles.eyebrow}>TELL US YOUR EPP APPLICATION</div>
        <h2 id="home-contact-heading">Need help choosing?<br/>Talk to PARK.</h2>
        <p>Whether you need protective packaging or a lightweight moulded component, tell us what the part needs to do. We can discuss suitable EPP grades, shapes and the details needed for your enquiry.</p>
        <div className={styles.topics}>
          {['Find an EPP solution for your application', 'Discuss dimensions and custom formats', 'Explore EPP grades and density options'].map(text => (
            <div key={text}><span><Check size={15} aria-hidden="true"/></span>{text}</div>
          ))}
        </div>
        <a className={styles.email} href="mailto:sales@parknonwoven.com">
          <span className={styles.emailIcon}><Mail size={18} aria-hidden="true"/></span>
          <span><small>PREFER TO EMAIL US?</small>sales@parknonwoven.com</span>
          <ArrowUpRight size={18} aria-hidden="true"/>
        </a>
      </div>

      <form className={styles.card} data-reveal onChange={enquiry.clear} onReset={() => setMessage('')} onSubmit={enquiry.submit} aria-busy={enquiry.state==='sending'}>
        <input name="botcheck" type="checkbox" tabIndex={-1} style={{display:'none'}} aria-hidden="true"/>
        <div className={styles.cardHeading}>
          <div>
            <span className={styles.kicker}>YOUR NEXT EPP SOLUTION</span>
            <h3>Let’s start with your needs.</h3>
            <p>Share your application, dimensions and quantity to get the conversation started.</p>
          </div>
          <span className={styles.headingIcon}><MessageSquareText size={23} strokeWidth={1.5} aria-hidden="true"/></span>
        </div>

        <div className={styles.fieldRow}>
          <label htmlFor="contact-name">Your name
            <span className={styles.control}>
              <UserRound size={17} aria-hidden="true"/>
              <input disabled={enquiry.state==='sending'} id="contact-name" name="name" autoComplete="name" placeholder="Full name" required maxLength={100}/>
            </span>
          </label>
          <label htmlFor="contact-email">Work email
            <span className={styles.control}>
              <Mail size={17} aria-hidden="true"/>
              <input disabled={enquiry.state==='sending'} id="contact-email" type="email" name="email" autoComplete="email" placeholder="you@company.com" required maxLength={254}/>
            </span>
          </label>
        </div>
        <label htmlFor="contact-message" className={styles.messageLabel}>
          <span>What do you need?<small>Application, size, grade or quantity</small></span>
          <span className={`${styles.control} ${styles.textarea}`}>
            <textarea disabled={enquiry.state==='sending'} id="contact-message" name="message" placeholder="Tell us about your application and the component you’re looking for…" required rows={4} maxLength={4000} value={message} onChange={event => setMessage(event.target.value)} aria-describedby="contact-message-help"/>
          </span>
        </label>
        <div className={styles.messageMeta}>
          <span id="contact-message-help">Existing drawings and dimensions are helpful, if available.</span>
          <span aria-hidden="true">{message.length.toLocaleString('en-US')} / 4,000</span>
        </div>
        <div className={styles.submitRow}>
          <button className={styles.submit} type="submit" disabled={enquiry.disabled}>{enquiry.state==='sending'?'Sending...':'Send enquiry'} <Send size={17} aria-hidden="true"/></button>
          <span className={styles.submitCaption}>EPP &middot; EXPANDED POLYPROPYLENE</span>
        </div>
        <p className={styles.deliveryNote} role={enquiry.state==='error'?'alert':'status'}>
          <Mail size={13} aria-hidden="true"/>
          {enquiry.message || 'Submit your enquiry here. Our team will reply to your email.'}
        </p>
      </form>
    </section>
  );
}
