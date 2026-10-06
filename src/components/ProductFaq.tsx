import {Icon} from './ui';
import styles from './ProductFaq.module.css';

type ProductFaqProps = {
  product: string;
  questions: ReadonlyArray<readonly [string, string]>;
};

export default function ProductFaq({product, questions}: ProductFaqProps) {
  return <section className={styles.section} aria-labelledby="product-faq-heading">
    <div className={styles.layout}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>PRODUCT KNOW-HOW</p>
        <h2 id="product-faq-heading">Good questions.<br/><span>Clear answers.</span></h2>
        <p className={styles.description}>A few things to know before choosing {product.toLowerCase()}.</p>
        <a className={styles.contact} href="#enquire">Talk through your project <Icon kind="arrow"/></a>
      </div>
      <div className={styles.questions}>
        <p className={styles.label}>FREQUENTLY ASKED QUESTIONS</p>
        {questions.map(([question, answer], index) => <details className={styles.item} name="product-faq" key={question} open={index === 0}>
          <summary className={styles.question}>
            <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.questionText}>{question}</span>
            <span className={styles.toggle} aria-hidden="true"/>
          </summary>
          <div className={styles.answer}><p>{answer}</p></div>
        </details>)}
      </div>
    </div>
  </section>;
}
