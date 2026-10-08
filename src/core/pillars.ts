import { MAX_PILLARS, MAX_POINTS } from './types';
import type { Bounds, Pillar, PillarSet, Point } from './types';
import { seeded } from './synthetic';
export function groupPoints(points:Point[], size:number, bounds:Bounds, maxPillars=MAX_PILLARS, maxPoints=MAX_POINTS):PillarSet {
  if(!Number.isFinite(size)||size<=0)throw new Error('Cạnh pillar phải dương.');
  const width=Math.ceil((bounds.xmax-bounds.xmin)/size),height=Math.ceil((bounds.ymax-bounds.ymin)/size), all=new Map<string,Pillar>(); let validPointCount=0;
  points.forEach((p,i)=>{if(p.x<bounds.xmin||p.x>=bounds.xmax||p.y<bounds.ymin||p.y>=bounds.ymax||p.z<bounds.zmin||p.z>=bounds.zmax)return;validPointCount++; const ix=Math.floor((p.x-bounds.xmin)/size),iy=Math.floor((p.y-bounds.ymin)/size),key=`${ix},${iy}`;let pillar=all.get(key);if(!pillar){pillar={key,ix,iy,cx:bounds.xmin+(ix+.5)*size,cy:bounds.ymin+(iy+.5)*size,indices:[],sampled:[],mean:[0,0,0]};all.set(key,pillar);}pillar.indices.push(i);});
  const rnd=seeded(427); const sample=<T,>(a:T[],n:number)=>{const copy=[...a];if(copy.length>n){for(let i=copy.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}copy.length=n;}return copy;};
  const pillars=sample([...all.values()],maxPillars),lookup=new Map<string,Pillar>(),pointKeys=new Map<number,string>();
  for(const p of pillars){p.sampled=sample(p.indices,maxPoints); // Mean of all real points in this cell, before truncation.
    for(const i of p.indices){p.mean[0]+=points[i].x;p.mean[1]+=points[i].y;p.mean[2]+=points[i].z;pointKeys.set(i,p.key);}p.mean=p.mean.map(v=>v/p.indices.length) as [number,number,number];lookup.set(p.key,p);}
  return {pillars,lookup,pointKeys,width,height,bounds,size,totalNonempty:all.size,validPointCount};
}
