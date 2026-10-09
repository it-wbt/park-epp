'use client';
import {useState} from 'react';
import {ArrowUpRight, UserRound, Mail, Send, Check, MessageSquareText} from './ContactIcons';
import styles from './HomeContact.module.css';

/** PARK Filtration's contact layout, with the EPP application content. */
export default function HomeContact() {
  const [ready, setReady] = useState(false);
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

      <form className={styles.card} data-reveal onChange={() => setReady(false)} onSubmit={event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
        window.location.href = `mailto:sales@parknonwoven.com?subject=${encodeURIComponent('EPP enquiry — ' + data.get('industry'))}&body=${encodeURIComponent(body)}`;
        setReady(true);
      }}>
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
              <input id="contact-name" name="name" autoComplete="name" placeholder="Full name" required maxLength={100}/>
            </span>
          </label>
          <label htmlFor="contact-email">Work email
            <span className={styles.control}>
              <Mail size={17} aria-hidden="true"/>
              <input id="contact-email" type="email" name="email" autoComplete="email" placeholder="you@company.com" required maxLength={254}/>
            </span>
          </label>
        </div>
        <label htmlFor="contact-message" className={styles.messageLabel}>
          <span>What do you need?<small>Application, size, grade or quantity</small></span>
          <span className={`${styles.control} ${styles.textarea}`}>
            <textarea id="contact-message" name="message" placeholder="Tell us about your application and the component you’re looking for…" required rows={4} maxLength={4000} value={message} onChange={event => setMessage(event.target.value)} aria-describedby="contact-message-help"/>
          </span>
        </label>
        <div className={styles.messageMeta}>
          <span id="contact-message-help">Existing drawings and dimensions are helpful, if available.</span>
          <span aria-hidden="true">{message.length.toLocaleString('en-US')} / 4,000</span>
        </div>
        <div className={styles.submitRow}>
          <button className={styles.submit} type="submit">Prepare email enquiry <Send size={17} aria-hidden="true"/></button>
          <span className={styles.submitCaption}>EPP &middot; EXPANDED POLYPROPYLENE</span>
        </div>
        <p className={styles.deliveryNote} role="status">
          <Mail size={13} aria-hidden="true"/>
          {ready ? 'Your email app has been requested. Review the message and send it there, or email us directly.' : 'Opens your email app with your enquiry ready to review and send.'}
        </p>
      </form>
    </section>
  );
}
