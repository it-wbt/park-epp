import {productVisual, productVisualAlt, productVisualCaption, type Product} from '../lib/content';
import {factoryVisualFor} from '../lib/factory-media';
import styles from './ProductImage.module.css';

export default function ProductImage({product}: {product: Product}) {
  const isFactory = Boolean(factoryVisualFor(product));
  return <div className={`detail-image ${isFactory ? styles.factory : ''}`}>
    <img src={productVisual(product)} alt={productVisualAlt(product)} width="1440" height="960" fetchPriority="high"/>
    {!isFactory && <span>{productVisualCaption(product)}</span>}
  </div>;
}
