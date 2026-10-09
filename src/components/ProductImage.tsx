import ResponsiveImage from './ResponsiveImage';
import {productVisual, productVisualAlt, productVisualCaption, isBrandedProduct, type Product} from '../lib/content';
import {factoryVisualFor} from '../lib/factory-media';
import styles from './ProductImage.module.css';

export default function ProductImage({product}: {product: Product}) {
  const isFactory = !isBrandedProduct(product) && Boolean(factoryVisualFor(product));
  return <div data-cutout={isBrandedProduct(product) || undefined} className={`detail-image ${isFactory ? styles.factory : isBrandedProduct(product) ? styles.cutout : ''}`}>
    <ResponsiveImage sizes="(max-width: 760px) 100vw, 44vw" src={productVisual(product)} alt={productVisualAlt(product)} width="1440" height="960" fetchPriority="high"/>
    {!isFactory && <span>{productVisualCaption(product)}</span>}
  </div>;
}
