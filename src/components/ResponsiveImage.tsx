import type {ImgHTMLAttributes} from 'react';
import optimizedImages from '../lib/optimized-images.json';

/** Offline responsive assets work with the static export, without an image server. */
export default function ResponsiveImage({src,alt='',sizes='(max-width: 760px) 100vw, 50vw',decoding='async',width,height,...props}:ImgHTMLAttributes<HTMLImageElement>) {
 const asset=src?optimizedImages[src as keyof typeof optimizedImages]:undefined;
 return <img {...props} src={asset?.src || src} srcSet={asset?.srcSet} sizes={asset?sizes:undefined} alt={alt} decoding={decoding} width={width || asset?.width} height={height || asset?.height}/>;
}
