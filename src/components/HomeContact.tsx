'use client';

import {useState} from 'react';
import {markets} from '../lib/catalog';
import {ArrowUpRight, UserRound, Mail, Building2, Factory, ChevronDown, Send, Check, MessageSquareText} from './ContactIcons';
import styles from './HomeContact.module.css';

const industryHints: Record<string, string> = Object.fromEntries([
  ...markets.map(market => [market.name, market.intro]),
]);

/** PARK Filtration's contact layout, with the EPP application content. */
export default function HomeContact() {
  const [ready, setReady] = useState(false);
  const [industry, setIndustry] = useState('');
  const [message, setMessage] = useState('');

  return (
    <section id="contact" className={styles.section} aria-labelledby="home-contact-heading">
      <div className={styles.introduction} data-reveal>
        <div className={styles.eyebrow}>LET’S TALK</div>
        <h2 id="home-contact-heading">Your next idea<br/>starts here.</h2>
        <p>Tell us what your product needs to do. Bring your drawings, dimensions, planned quantities and the challenge you want to solve.</p>
        <div className={styles.topics}>
          {['Find a material for your application', 'Discuss dimensions and custom formats', 'Explore materials and grade options'].map(text => (
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
        const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company') || 'Not specified'}\nIndustry: ${data.get('industry')}\n\n${data.get('message')}`;
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
        <div className={styles.fieldRow}>
          <label htmlFor="contact-company"><span>Company <small>Optional</small></span>
            <span className={styles.control}>
              <Building2 size={17} aria-hidden="true"/>
              <input id="contact-company" name="company" autoComplete="organization" placeholder="Company or organisation" maxLength={150}/>
            </span>
          </label>
          <label htmlFor="contact-industry">Your industry
            <span className={`${styles.control} ${styles.select}`}>
              <Factory size={17} aria-hidden="true"/>
              <select id="contact-industry" name="industry" value={industry} onChange={event => setIndustry(event.target.value)} aria-describedby={industry ? 'contact-industry-hint' : undefined} required>
                <option value="" disabled>Select your industry</option>
                {Object.keys(industryHints).map(item => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown size={15} className={styles.selectArrow} aria-hidden="true"/>
            </span>
          </label>
        </div>
        {industry && <p className={styles.industryHint} id="contact-industry-hint"><span/>{industryHints[industry]}</p>}

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
          <span className={styles.submitCaption}>EPP · EPS · ENGINEERED MATERIALS</span>
        </div>
        <p className={styles.deliveryNote} role="status">
          <Mail size={13} aria-hidden="true"/>
          {ready ? 'Your email app has been requested. Review the message and send it there, or email us directly.' : 'Opens your email app with your enquiry ready to review and send.'}
        </p>
      </form>
    </section>
  );
}
