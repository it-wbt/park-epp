import ResponsiveImage from './ResponsiveImage';
import Link from 'next/link';
import {markets} from '../lib/catalog';
import {industryStories} from '../lib/industry-stories';
import {marketImagePath} from '../lib/navigation';
import {Icon} from './ui';
import styles from './IndustryDetail.module.css';

export {default} from './IndustryLanding';

export function IndustryIndex() {
  return <div className={styles.industryIndex}>{markets.map((market, index) => {
    const story = industryStories[market.slug];
    const image = story?.heroImage || marketImagePath(market.slug);
    const alt = story?.heroAlt || `${market.name} EPP application illustration`;
    const intro = story?.intro || market.intro;
    return <Link href={`/markets/${market.slug}/`} key={market.slug} data-reveal><div className={styles.indexImage}><ResponsiveImage src={image} alt={alt} width="1440" height="960" loading="lazy"/><span>0{index + 1}</span></div><div className={styles.indexCopy}><h2>{market.name}</h2><Icon kind="arrow"/><p>{intro}</p></div></Link>;
  })}</div>;
}
