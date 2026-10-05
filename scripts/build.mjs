import {spawnSync} from 'node:child_process';
const result=spawnSync(process.execPath,['node_modules/next/dist/bin/next','build'],{stdio:'inherit'});
if(result.status!==0)process.exit(result.status||1);
await import('./normalise-export.mjs');
