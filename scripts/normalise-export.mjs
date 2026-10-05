import {readdirSync,copyFileSync} from 'node:fs';
import path from 'node:path';
// Static servers request Next's route-segment payload names as dotted paths.
// Preserve nested payloads and supply the flat aliases emitted by client URLs.
const root=path.resolve('out');let copied=0;
function visit(directory){for(const entry of readdirSync(directory,{withFileTypes:true})){const current=path.join(directory,entry.name);if(entry.isDirectory())visit(current);else if(entry.name.endsWith('.txt')){const relative=path.relative(root,current).split(path.sep);const index=relative.findIndex(v=>v.startsWith('__next.'));if(index>=0&&index<relative.length-1){const dest=path.join(root,...relative.slice(0,index),relative.slice(index).join('.'));copyFileSync(current,dest);copied++;}}}}
visit(root);console.log(`Static route payloads: ${copied} flat aliases created.`);
