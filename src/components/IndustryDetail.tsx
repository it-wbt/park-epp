import ResponsiveImage from './ResponsiveImage';
import Link from 'next/link';
import {markets} from '../lib/catalog';
import {industryStories} from '../lib/industry-stories';
import {Icon} from './ui';
import styles from './IndustryDetail.module.css';

export {default} from './IndustryLanding';

export function IndustryIndex() {
  return <div className={styles.industryIndex}>{markets.map((market, index) => {
    const story = industryStories[market.slug];
    return <Link href={`/markets/${market.slug}/`} key={market.slug} data-reveal><div className={styles.indexImage}><ResponsiveImage src={story.heroImage} alt={story.heroAlt} width="1440" height="960" loading="lazy"/><span>0{index + 1}</span></div><div className={styles.indexCopy}><h2>{market.name}</h2><Icon kind="arrow"/><p>{story.intro}</p></div></Link>;
  })}</div>;
}
