import { seeded } from './synthetic';
import { pointFeatures } from './features';
import type { Pillar, Point } from './types';
const rnd=seeded(181205784);
export const WEIGHTS=Array.from({length:64},()=>Array.from({length:9},()=>rnd()*2-1));
const BIAS=Array.from({length:64},()=>rnd()*.8-.4);
// Fixed BN inference parameters for an educational transform; no learned weights.
export function encodePoint(f:number[]):number[]{return WEIGHTS.map((w,c)=>Math.max(0,(w.reduce((s,v,j)=>s+v*f[j],BIAS[c])-.15)/Math.sqrt(4+1e-5)));}
export function maxPool(rows:number[][],channels=64):number[]{return Array.from({length:channels},(_,c)=>rows.reduce((m,row)=>Math.max(m,row[c]),0));}
export function encodePillar(p:Pillar,points:Point[]){const rows=p.sampled.map(i=>encodePoint(pointFeatures(points[i],p)));return {rows,vector:maxPool(rows)};}
export function encodeAll(pillars:Pillar[],points:Point[]):Map<string,number[]>{return new Map(pillars.map(p=>[p.key,encodePillar(p,points).vector]));}
