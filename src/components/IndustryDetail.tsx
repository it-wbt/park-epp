import Link from 'next/link';
import {markets, activeProducts, marketSourceSlugs} from '../lib/catalog';
import {industryStories, type IndustryStory} from '../lib/industry-stories';
import {productVisual} from '../lib/content';
import {Icon} from './ui';
import styles from './IndustryDetail.module.css';

const developmentSteps = [
  ['Start with the application', 'Bring the product, drawing and the job it needs to do. Together, define the important interfaces and operating conditions.'],
  ['Shape the component', 'Work through material, moulded geometry and tooling details around your assembly or packaging layout.'],
  ['Try it in the real system', 'Use representative samples to review fit, handling and the performance targets agreed for the project.'],
  ['Prepare for production', 'Confirm the specification, quantities, inspection points and packing requirements for the finished part.'],
];

export default function IndustryDetail({story}: {story: IndustryStory}) {
  const market = markets.find(item => item.slug === story.slug)!;
  const catalogue = activeProducts.filter(product => marketSourceSlugs(story.slug).includes(product.marketSlug));
  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="industry-title">
      <img className={styles.heroImage} src={story.heroImage} alt={story.heroAlt} width="1440" height="960" fetchPriority="high"/>
      <div className={styles.heroShade}/>
      <div className={styles.heroInner}>
        <p className={styles.kicker}>{story.eyebrow}</p>
        <h1 id="industry-title">{story.title[0]}<br/><span>{story.title[1]}</span></h1>
        <p className={styles.heroIntro}>{story.intro}</p>
        <div className={styles.heroActions}><a href="#industry-applications" className={styles.primary}>Explore applications <Icon kind="arrow"/></a><a href="#industry-brief" className={styles.heroLink}>Discuss your project <span>↗</span></a></div>
        <div className={styles.heroFooter}><span>PARK NONWOVEN / {market.name}</span><a href="#industry-overview" aria-label="Discover this industry"><span>Discover more</span> ↓</a></div>
      </div>
    </section>

    <nav className={styles.sectionNav} aria-label="Industry page sections"><div>
      <a href="#industry-overview">The possibilities</a><a href="#industry-applications">Applications</a><a href="#industry-material">Why EPP</a><a href="#industry-range">Product range</a><a href="#industry-brief">Let’s talk <Icon kind="arrow"/></a>
    </div></nav>

    <section id="industry-overview" className={`${styles.container} ${styles.overview}`} aria-labelledby="industry-overview-title">
      <div data-reveal><p className={styles.kicker}>{story.overview.eyebrow}</p><h2 id="industry-overview-title">{story.overview.title}</h2></div>
      <div><p className={styles.overviewCopy}>{story.overview.body}</p><div className={styles.benefits}>{story.benefits.map(benefit => <div key={benefit.title} data-reveal><Icon kind={benefit.icon}/><div><h3>{benefit.title}</h3><p>{benefit.text}</p></div></div>)}</div></div>
    </section>

    <section id="industry-applications" className={styles.applicationSection} aria-labelledby="industry-applications-title"><div className={styles.container}>
      <div className={styles.sectionHeading} data-reveal><div><p className={styles.kicker}>MADE FOR THE WAY YOU WORK</p><h2 id="industry-applications-title">Find your application.</h2></div><a href="#industry-range" className={styles.textLink}>View the product range <Icon kind="arrow"/></a></div>
      <div className={styles.applicationGrid}>{story.applications.map((application, index) => <Link key={application.productSlug} className={styles.application} href={`/products/${application.productSlug}/`} data-reveal>
        <div className={styles.applicationImage}><img src={application.image} alt={application.imageAlt} width="480" height="320" loading="lazy"/></div>
        <div><span className={styles.number}>0{index + 1}</span><h3>{application.title}</h3><p>{application.text}</p><span className={styles.applicationLink}>Explore application <Icon kind="arrow"/></span></div>
      </Link>)}</div>
    </div></section>

    <section id="industry-material" className={`${styles.container} ${styles.material}`} aria-labelledby="industry-material-title">
      <div className={styles.materialImage}><img src={story.material.image} alt={story.material.imageAlt} width="1100" height="733" loading="lazy"/><span>EPP / ENGINEERED AROUND THE APPLICATION</span></div>
      <div className={styles.materialCopy} data-reveal><p className={styles.kicker}>LIGHT IN WEIGHT. BIG ON POSSIBILITY.</p><h2 id="industry-material-title">{story.material.title}</h2><p>{story.material.text}</p><ul>{story.material.bullets.map(item => <li key={item}><Icon kind="check"/>{item}</li>)}</ul><Link className={styles.textLink} href="/materials/expanded-polypropylene/">Get to know EPP <Icon kind="arrow"/></Link></div>
    </section>

    <section className={styles.processSection} aria-labelledby="industry-process-title"><div className={styles.container}>
      <div className={styles.sectionHeading} data-reveal><div><p className={styles.kicker}>FROM YOUR IDEA TO A MOULDED PART</p><h2 id="industry-process-title">Let’s shape what comes next.</h2></div><p>A practical development conversation, built around your product.</p></div>
      <ol className={styles.process}>{developmentSteps.map(([title, text], index) => <li key={title} data-reveal><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
    </div></section>

    <section id="industry-range" className={`${styles.container} ${styles.range}`} aria-labelledby="industry-range-title">
      <div className={styles.sectionHeading} data-reveal><div><p className={styles.kicker}>A CLOSER LOOK</p><h2 id="industry-range-title">Explore the range.</h2></div><span className={styles.rangeCount}>{catalogue.length} product families</span></div>
      <div className={styles.productList}>{catalogue.slice(0, 4).map(product => <Link href={`/products/${product.slug}/`} key={product.slug}><img src={productVisual(product)} alt="" width="92" height="68" loading="lazy"/><span><strong>{product.name}</strong><small>{product.material}</small></span><Icon kind="arrow"/></Link>)}</div>
      {catalogue.length > 4 && <details className={styles.moreProducts}><summary>See all {catalogue.length} product families <Icon kind="arrow"/></summary><div className={styles.productList}>{catalogue.slice(4).map(product => <Link href={`/products/${product.slug}/`} key={product.slug}><img src={productVisual(product)} alt="" width="92" height="68" loading="lazy"/><span><strong>{product.name}</strong><small>{product.material}</small></span><Icon kind="arrow"/></Link>)}</div></details>}
    </section>

    <section className={`${styles.container} ${styles.questions}`} aria-labelledby="industry-faq-title"><div data-reveal><p className={styles.kicker}>BEFORE WE BEGIN</p><h2 id="industry-faq-title">A few useful answers.</h2><p>Start here, then bring us the details that make your project different.</p></div><div className={styles.faq}>{story.faq.map(item => <details key={item.question}><summary>{item.question}<Icon kind="close"/></summary><p>{item.answer}</p></details>)}</div></section>

    <section id="industry-brief" className={styles.brief} aria-labelledby="industry-brief-title"><div className={styles.container}>
      <div data-reveal><p className={styles.kicker}>YOUR NEXT PROJECT STARTS HERE</p><h2 id="industry-brief-title">Bring the challenge.<br/><span>We’ll help shape the solution.</span></h2><Link className={styles.primary} href="/contact/">Talk to PARK <Icon kind="arrow"/></Link></div>
      <div><h3>A useful starting brief</h3><ul>{story.brief.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul><a className={styles.briefEmail} href="mailto:sales@parknonwoven.com">sales@parknonwoven.com ↗</a></div>
    </div></section>
    <nav className={`${styles.container} ${styles.otherIndustries}`} aria-label="Other industries"><span>More EPP possibilities</span>{markets.filter(item => item.slug !== story.slug).map(item => <Link key={item.slug} href={`/markets/${item.slug}/`}>{item.name} <span>↗</span></Link>)}</nav>
  </div>;
}

export function IndustryIndex() {
  return <div className={styles.industryIndex}>{markets.map((market, index) => {
    const story = industryStories[market.slug];
    return <Link href={`/markets/${market.slug}/`} key={market.slug} data-reveal><div className={styles.indexImage}><img src={story.heroImage} alt={story.heroAlt} width="1440" height="960" loading="lazy"/><span>0{index + 1}</span></div><div className={styles.indexCopy}><h2>{market.name}</h2><Icon kind="arrow"/><p>{story.intro}</p></div></Link>;
  })}</div>;
}
