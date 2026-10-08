import type { PillarSet } from './types';
export function scatterChannel(set:PillarSet,vectors:Map<string,number[]>,channel:number):Float32Array { const image=new Float32Array(set.width*set.height);for(const p of set.pillars)image[p.iy*set.width+p.ix]=vectors.get(p.key)?.[channel]??0;return image; }
