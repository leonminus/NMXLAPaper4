import type { Pillar, Point } from './types';
export const FEATURE_NAMES=['x','y','z','r','x_c','y_c','z_c','x_p','y_p'];
export function pointFeatures(p:Point,pillar:Pillar):number[]{return[p.x,p.y,p.z,p.r,p.x-pillar.mean[0],p.y-pillar.mean[1],p.z-pillar.mean[2],p.x-pillar.cx,p.y-pillar.cy];}
